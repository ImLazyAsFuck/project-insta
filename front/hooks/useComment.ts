import {
  CommentRequest,
  CommentResponse,
} from "@/interfaces/comment.interface";
import { PostResponse } from "@/interfaces/post.interface";
import {
  createComment,
  deleteComment,
  fetchCommentsByPostId,
  toggleCommentReaction,
} from "@/services/comment.service";
import { BaseResponse } from "@/utils/response-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { POST_KEY } from "./usePost";

const COMMENT_KEY = ["comments"];

export const useCommentsByPostQuery = (postId: number) => {
  return useQuery<BaseResponse<CommentResponse>>({
    queryKey: [...COMMENT_KEY, "post", postId],
    queryFn: () => fetchCommentsByPostId(postId),
    enabled: !!postId,
  });
};

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentRequest: CommentRequest) =>
      createComment(commentRequest),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: [...POST_KEY, "feeds"] });
      const previousFeeds = queryClient.getQueryData<BaseResponse<PostResponse>>([
        ...POST_KEY,
        "feeds",
      ]);
      
      if (previousFeeds) {
        queryClient.setQueryData<BaseResponse<PostResponse>>(
          [...POST_KEY, "feeds"],
          {
            ...previousFeeds,
            data: previousFeeds.data.map((post) =>
              post.id === variables.postId
                ? { ...post, totalComments: post.totalComments + 1 }
                : post
            ),
          }
        );
      }
      
      return { previousFeeds };
    },
    onError: (err, variables, context) => {
      if (context?.previousFeeds) {
        queryClient.setQueryData([...POST_KEY, "feeds"], context.previousFeeds);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENT_KEY, "post", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: [...POST_KEY, "feeds"] });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
      deleteComment(commentId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: [...POST_KEY, "feeds"] });
      const previousFeeds = queryClient.getQueryData<BaseResponse<PostResponse>>([
        ...POST_KEY,
        "feeds",
      ]);
      
      if (previousFeeds) {
        queryClient.setQueryData<BaseResponse<PostResponse>>(
          [...POST_KEY, "feeds"],
          {
            ...previousFeeds,
            data: previousFeeds.data.map((post) =>
              post.id === variables.postId
                ? { ...post, totalComments: Math.max(0, post.totalComments - 1) }
                : post
            ),
          }
        );
      }
      
      return { previousFeeds };
    },
    onError: (err, variables, context) => {
      if (context?.previousFeeds) {
        queryClient.setQueryData([...POST_KEY, "feeds"], context.previousFeeds);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENT_KEY, "post", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: [...POST_KEY, "feeds"] });
    },
  });
};

export const useToggleCommentReactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
      toggleCommentReaction(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENT_KEY, "post", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: [...POST_KEY, "feeds"] });
    },
  });
};
