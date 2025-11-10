import {
  CommentRequest,
  CommentResponse,
} from "@/interfaces/comment.interface";
import {
  createComment,
  deleteComment,
  fetchCommentsByPostId,
} from "@/services/comment.service";
import { togglePostReaction } from "@/services/post.service";
import { SingleResponse } from "@/utils/response-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { POST_KEY } from "./usePost";

const COMMENT_KEY = ["comments"];

export const useCommentsByPostQuery = (postId: number) => {
  return useQuery<SingleResponse<CommentResponse[]>>({
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
      togglePostReaction(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COMMENT_KEY, "post", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: [...POST_KEY, "feeds"] });
    },
  });
};
