import { ProfileResponse } from "@/interfaces/profile.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const fetchBlockedUsers = async (): Promise<
  BaseResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get(`/block`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const blockUser = async (userId: number): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.post(`/block/${userId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};


export const unblockUser = async (
  userId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.delete(`/block/${userId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
