import {
  MessageAttachment,
  MessageMediaRequest,
  MessageReactionResponse,
  MessageRequest,
  MessageResponse,
} from "./message.interface";
import { UserSummaryResponse } from "./user.interface";

export interface ConversationResponse {
  id: number;
  name: string;
  createdAt: string;
  users: UserSummaryResponse[];
  messages: MessageResponse[];
  group: boolean;
}

export interface ConversationRequest {
  senderId: number;
  conversationId: number;
  mediaFiles: File[];
}

export {
  MessageAttachment,
  MessageMediaRequest,
  MessageReactionResponse,
  MessageRequest,
  MessageResponse,
};
