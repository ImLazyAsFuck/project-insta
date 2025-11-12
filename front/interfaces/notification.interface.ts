import { UserSummaryResponse } from "./user.interface";

export interface NotificationResponse {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: UserSummaryResponse;
  conversationId: number;
}
