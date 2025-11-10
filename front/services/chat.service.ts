import {
  MessageRequest,
  MessageResponse,
} from "@/interfaces/message.interface";
import { EReactionType } from "@/types/reaction.enum";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const sendMessage = async (message: MessageRequest) => {
  const formData = new FormData();
  formData.append("conversationId", String(message.conversationId));
  formData.append("senderId", String(message.senderId));
  if (message.content) formData.append("content", message.content);
  message.files?.forEach((file) => formData.append("files", file));

  const res = await axiosInstance.post("/chat/send", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};



export const deleteMessage = async (
  messageId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.delete(`/chat/${messageId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const reactMessage = async (
  messageId: number,
  type: EReactionType
): Promise<SingleResponse<MessageResponse>> => {
  try {
    const res = await axiosInstance.post("/chat/react", { messageId, type });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const getMessagesByConversation = async (
  conversationId: number
): Promise<BaseResponse<MessageResponse>> => {
  try {
    const res = await axiosInstance.get(`/chat/conversation/${conversationId}`);
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const getMyMessages = async (): Promise<
  BaseResponse<MessageResponse>
> => {
  try {
    const res = await axiosInstance.get("/chat/me");
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
