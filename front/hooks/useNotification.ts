import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationResponse } from "@/interfaces/notification.interface";
import { fetchNotifications } from "@/services/notification.service";
import { BaseResponse } from "@/utils/response-data";

export const NOTIFICATION_KEY = ["notifications"];

export const useNotificationsQuery = () => {
  return useQuery<BaseResponse<NotificationResponse>>({
    queryKey: NOTIFICATION_KEY,
    queryFn: fetchNotifications,
  });
};

