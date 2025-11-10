import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostRequest, PostResponse } from "@/interfaces/post.interface";
import {
  createPost,
  togglePostReaction,
  fetchOwnPosts,
  fetchFeeds,
  fetchOtherPosts,
} from "@/services/post.service";
import { BaseResponse, SingleResponse } from "@/utils/response-data";

export const POST_KEY = ["posts"];

export const useOwnPostsQuery = () => {
  return useQuery<BaseResponse<PostResponse>>({
    queryKey: [...POST_KEY, "own"],
    queryFn: fetchOwnPosts,
  });
};

export const useFeedsQuery = () => {
  return useQuery<BaseResponse<PostResponse>>({
    queryKey: [...POST_KEY, "feeds"],
    queryFn: fetchFeeds,
  });
};

export const useOtherPostsQuery = (userId: number) => {
  return useQuery<BaseResponse<PostResponse>>({
    queryKey: [...POST_KEY, "other", userId],
    queryFn: () => fetchOtherPosts(userId),
    enabled: !!userId,
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleResponse<PostResponse>, unknown, PostRequest>({
    mutationFn: (post) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...POST_KEY, "own"] });
      queryClient.invalidateQueries({ queryKey: [...POST_KEY, "feeds"] });
    },
  });

};


export const useTogglePostReactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleResponse<void>,
    unknown,
    { postId: number }
  >({
    mutationFn: ({ postId }) => togglePostReaction(postId),
    onSuccess: (_, variables) => {
        queryClient.setQueryData([...POST_KEY, "feeds"], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((post: PostResponse) =>
              post.id === variables.postId
                ? {
                    ...post,
                    reactedByCurrentUser: !post.reactedByCurrentUser,
                    totalReactions: post.reactedByCurrentUser
                      ? post.totalReactions - 1
                      : post.totalReactions + 1,
                  }
                : post
            ),
          };
        });
      },
  });
};
