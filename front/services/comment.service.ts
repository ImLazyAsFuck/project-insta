import {
  CommentRequest,
  CommentResponse,
} from "@/interfaces/comment.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const fetchCommentsByPostId = async (
  postId: number
): Promise<BaseResponse<CommentResponse>> => {
  try {
    const res = await axiosInstance.get(`comments/post/${postId}`);

    if (!res.data) {
      throw {
        message: res.data?.message,
        error: res.data?.error,
        status: res.data?.status,
      };
    }

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

    if (!res.data || !res.data.data) {
      throw {
        message: res.data.message,
        error: res.data.error,
        status: res.data.status,
      };
    }

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

    if (!res.data || !res.data.data) {
      throw {
        message: res.data.message,
        error: res.data.error,
        status: res.data.status,
      };
    }

    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const toggleCommentReaction = async (
  commentId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.post(`/comments/${commentId}/reaction`);

    if (!res.data || !res.data.data) {
      throw {
        message: res.data.message,
        error: res.data.error,
        status: res.data.status,
      };
    }

    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
