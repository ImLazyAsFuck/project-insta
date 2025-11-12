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

export const rejectFollowRequest = async (
  followId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.put(`/follows/decline/${followId}`);

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

export const sendFollowRequest = async (
  followingId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.post(`/follows/${followingId}`);

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

export const fetchFollowRequests = async (): Promise<
  BaseResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get(`/follows/requests`);

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

export const fetchFollowings = async (): Promise<
  BaseResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get(`/follows/following`);

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

export const fetchFollowers = async (): Promise<
  BaseResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get(`/follows/followers`);

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

export const removeFollow = async (
  followId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.delete(`/follows/${followId}`);

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

export const fetchFollowStatus = async (
  targetId: number
): Promise<SingleResponse<EFollowStatus>> => {
  try {
    const res = await axiosInstance.get(`/follows/status/${targetId}`);

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
