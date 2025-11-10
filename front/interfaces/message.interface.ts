import { EReactionType } from "@/types/reaction.enum";
import { UserSummaryResponse } from "./user.interface";

export interface MessageRequest {
  conversationId: number;
  content?: string | null;
  files?: File[];
  senderId: number;
}

export interface MessageReactionResponse {
  id: number;
  userId: number;
  username: string;
  type: EReactionType;
}

export interface MessageResponse {
  id: number;
  conversationId: number;
  sender: UserSummaryResponse;
  content?: string | null;
  mediaUrls: string[];
  createdAt: string;
  reactions: MessageReactionResponse[];
}
