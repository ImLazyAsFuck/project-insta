import { EReactionType } from "@/types/reaction.enum";
import { UserSummaryResponse } from "./user.interface";

export type MessageAttachment = {
  uri: string;
  name: string;
  type: string;
};

export interface MessageRequest {
  conversationId: number;
  senderId: number;
  content?: string | null;
}

export interface MessageMediaRequest {
  conversationId: number;
  senderId: number;
  mediaFiles: MessageAttachment[];
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

