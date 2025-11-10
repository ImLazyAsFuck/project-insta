import {
  CommentRequest,
  CommentResponse,
} from "@/interfaces/comment.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const fetchCommentsByPostId = async (postId: number) => {
  try {
    const res = await axiosInstance.get(`comments/post/${postId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const createComment = async (
  commentRequest: CommentRequest
): Promise<SingleResponse<CommentResponse>> => {
  try {
    const res = await axiosInstance.post("comments", commentRequest);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const deleteComment = async (
  commentId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.delete(`comments/${commentId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const togglePostReaction = async (
  commentId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.post(`comments/${commentId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
