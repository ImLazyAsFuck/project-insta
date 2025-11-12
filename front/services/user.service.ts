import { ProfileResponse } from "@/interfaces/profile.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const searchUsersByUsername = async (
  username: string
): Promise<BaseResponse<ProfileResponse>> => {
  try {
    const res = await axiosInstance.get(`/users/search?username=${username}`);

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

export const getProfileByUsername = async (
  username: string
): Promise<SingleResponse<ProfileResponse>> => {
  try {
    const res = await axiosInstance.get(`/users/profile/${username}`);

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