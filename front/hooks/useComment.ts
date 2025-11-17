import {
  CommentRequest,
  CommentResponse,
} from "@/interfaces/comment.interface";
import { PostResponse } from "@/interfaces/post.interface";
import { ProfileResponse } from "@/interfaces/profile.interface";
import {
  createComment,
  deleteComment,
  fetchCommentsByPostId,
  toggleCommentReaction,
} from "@/services/comment.service";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
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
      const commentQueryKey = [...COMMENT_KEY, "post", variables.postId];
      const feedQueryKey = [...POST_KEY, "feeds"];

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: commentQueryKey });
      await queryClient.cancelQueries({ queryKey: feedQueryKey });

      // Snapshot the previous value
      const previousComments =
        queryClient.getQueryData<BaseResponse<CommentResponse>>(
          commentQueryKey
        );
      const previousFeeds =
        queryClient.getQueryData<BaseResponse<PostResponse>>(feedQueryKey);

      // Get current user from cache to build the optimistic comment
      const currentUser = queryClient.getQueryData<
        SingleResponse<ProfileResponse>
      >(["account", "profile"]);

      if (previousComments && currentUser) {
        const newComment: CommentResponse = {
          id: Date.now(), // Temporary ID
          content: variables.content,
          user: {
            id: currentUser.data.id,
            username: currentUser.data.username,
            fullName: currentUser.data.fullName,
            avatarUrl: currentUser.data.avatarUrl,
          },
          parentId: variables.parentId,
          reactionCount: 0,
          reactedByCurrentUser: false,
          createdAt: new Date().toISOString(),
          childComments: [],
        };

        const updatedComments = [...previousComments.data, newComment];

        queryClient.setQueryData<BaseResponse<CommentResponse>>(
          commentQueryKey,
          {
            ...previousComments,
            data: updatedComments,
          }
        );
      }

      if (previousFeeds) {
        queryClient.setQueryData<BaseResponse<PostResponse>>(feedQueryKey, {
          ...previousFeeds,
          data: previousFeeds.data.map((post) =>
            post.id === variables.postId
              ? { ...post, totalComments: post.totalComments + 1 }
              : post
          ),
        });
      }

      return { previousComments, previousFeeds };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          [...COMMENT_KEY, "post", variables.postId],
          context.previousComments
        );
      }
      if (context?.previousFeeds) {
        queryClient.setQueryData([...POST_KEY, "feeds"], context.previousFeeds);
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch after error or success
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
      const previousFeeds = queryClient.getQueryData<
        BaseResponse<PostResponse>
      >([...POST_KEY, "feeds"]);

      if (previousFeeds) {
        queryClient.setQueryData<BaseResponse<PostResponse>>(
          [...POST_KEY, "feeds"],
          {
            ...previousFeeds,
            data: previousFeeds.data.map((post) =>
              post.id === variables.postId
                ? {
                    ...post,
                    totalComments: Math.max(0, post.totalComments - 1),
                  }
                : post
            ),
          }
        );
      }

      return { previousFeeds };
    },
    onError: (_err, _variables, context) => {
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
    onMutate: async (variables) => {
      const queryKey = [...COMMENT_KEY, "post", variables.postId];
      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<BaseResponse<CommentResponse>>(queryKey);

      if (previousComments) {
        const updateComment = (
          comments: CommentResponse[]
        ): CommentResponse[] => {
          return comments.map((comment) => {
            if (comment.id === variables.commentId) {
              return {
                ...comment,
                reactedByCurrentUser: !comment.reactedByCurrentUser,
                reactionCount: comment.reactedByCurrentUser
                  ? comment.reactionCount - 1
                  : comment.reactionCount + 1,
              };
            }
            if (comment.childComments && comment.childComments.length > 0) {
              return {
                ...comment,
                childComments: updateComment(comment.childComments),
              };
            }
            return comment;
          });
        };

        queryClient.setQueryData<BaseResponse<CommentResponse>>(queryKey, {
          ...previousComments,
          data: updateComment(previousComments.data),
        });
      }

      return { previousComments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          [...COMMENT_KEY, "post", _variables?.postId],
          context.previousComments
        );
      }
    },
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENT_KEY, "post", _variables?.postId],
      });
      queryClient.invalidateQueries({ queryKey: [...POST_KEY, "feeds"] });
    },
  });
};
