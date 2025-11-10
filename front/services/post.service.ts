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
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const fetchOwnPosts = async (): Promise<BaseResponse<PostResponse>> => {
  try {
    const res = await axiosInstance.get("/posts/me");
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const fetchFeeds = async (): Promise<BaseResponse<PostResponse>> => {
  try {
    const res = await axiosInstance.get("/posts/feeds");
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
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
