import { ProfileResponse } from "@/interfaces/profile.interface";
import { EFollowStatus } from "@/types/follow.enum";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const acceptFollowRequest = async (
  followId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.put(`/follows/accept/${followId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const rejectFollowRequest = async (
  followId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.put(`/follows/decline/${followId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const sendFollowRequest = async (
  followingId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.post(`/follows/${followingId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const fetchFollowRequests = async (): Promise<
  BaseResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get(`/follows/requests`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const fetchFollowings = async (): Promise<
  BaseResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get(`/follows/following`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const fetchFollowers = async (): Promise<
  BaseResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get(`/follows/followers`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const removeFollow = async (
  followId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.delete(`/follows/${followId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const fetchFollowStatus = async (
  targetId: number
): Promise<SingleResponse<EFollowStatus>> => {
  try {
    const res = await axiosInstance.get(`/follows/status/${targetId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
