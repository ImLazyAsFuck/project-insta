import { PostRequest, PostResponse } from "@/interfaces/post.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const createPost = async (
  post: PostRequest
): Promise<SingleResponse<PostResponse>> => {
  try {
    const formData = new FormData();
    formData.append("content", post.content);
    formData.append("visibility", post.visibility);

    post.mediaFiles?.forEach((file) => {
      formData.append("mediaFiles", file);
    });

    const res = await axiosInstance.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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

export const togglePostReaction = async (
  postId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/reaction`);

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

export const fetchOwnPosts = async (): Promise<BaseResponse<PostResponse>> => {
  try {
    const res = await axiosInstance.get("/posts/me");

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

export const fetchFeeds = async (): Promise<BaseResponse<PostResponse>> => {
  try {
    const res = await axiosInstance.get("/posts/feeds");

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

export const fetchOtherPosts = async (
  userId: number
): Promise<BaseResponse<PostResponse>> => {
  try {
    const res = await axiosInstance.get(`/posts/other/${userId}`);

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

export const fetchPostDetail = async (
  postId: number
): Promise<SingleResponse<PostResponse>> => {
  try {
    const res = await axiosInstance.get(`/posts/${postId}`);

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
