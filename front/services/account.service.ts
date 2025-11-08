import {
  ChangePasswordRequest,
  ProfileRequestDTO,
  ProfileResponse,
} from "@/interfaces/profile.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const getProfile = async (): Promise<
  SingleResponse<ProfileResponse>
> => {
  try {
    const res = await axiosInstance.get("/accounts/profile");
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const changePassword = async (
  changePassword: ChangePasswordRequest
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.put(
      "/accounts/change-password",
      changePassword
    );
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const updateProfile = async (
  profile: ProfileRequestDTO
): Promise<SingleResponse<ProfileResponse>> => {
  try {
    const form = new FormData();
    if (profile.fullName !== undefined)
      form.append("fullName", profile.fullName);
    form.append("username", profile.username);
    form.append("email", profile.email);
    form.append("phoneNumber", profile.phoneNumber);
    if (profile.website !== undefined) form.append("website", profile.website);
    if (profile.bio !== undefined) form.append("bio", profile.bio);
    form.append("gender", String(profile.gender));

    const res = await axiosInstance.put("/accounts/profile", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const uploadAvatar = async (
  fileUri: string
): Promise<SingleResponse<ProfileResponse>> => {
  try {
    const formData = new FormData();

    formData.append("avatar", {
      uri: fileUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);

    const res = await axiosInstance.post("/accounts/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

