import { ProfileResponse } from "@/interfaces/profile.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const searchUsersByUsername = async (
  username: string
): Promise<BaseResponse<ProfileResponse>> => {
  try {
    const res = await axiosInstance.get(`/users/search?username=${username}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const getProfileByUsername = async (
  username: string
): Promise<SingleResponse<ProfileResponse>> => {
  try {
    const res = await axiosInstance.get(`/users/profile/${username}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};