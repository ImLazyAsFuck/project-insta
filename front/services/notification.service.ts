import { NotificationResponse } from "@/interfaces/notification.interface";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const fetchNotifications = async (): Promise<
  BaseResponse<NotificationResponse>
> => {
  try {
    const res = await axiosInstance.get("/notifications");

    if (!res.data) {
      throw {
        message: res.data?.message,
        error: res.data?.error,
        status: res.data?.status,
      };
    }
    console.log(res.data);

    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
