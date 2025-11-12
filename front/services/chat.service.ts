import { ConversationResponse } from "@/interfaces/chat.interface";
import {
  MessageMediaRequest,
  MessageRequest,
  MessageResponse,
} from "@/interfaces/message.interface";
import { EReactionType } from "@/types/reaction.enum";
import { axiosInstance } from "@/utils/axios-instance";
import { BaseResponse, SingleResponse } from "@/utils/response-data";
import { handleAxiosError } from "./error.service";

export const sendMessage = async (
  message: MessageRequest
): Promise<SingleResponse<MessageResponse>> => {
  try {
    const res = await axiosInstance.post("/chat/send", message);

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

export const sendMessageMedia = async (
  payload: MessageMediaRequest
): Promise<SingleResponse<MessageResponse>> => {
  try {
    const formData = new FormData();
    formData.append("conversationId", String(payload.conversationId));
    formData.append("senderId", String(payload.senderId));

    payload.mediaFiles.forEach((file) => {
      formData.append("mediaFiles", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    const res = await axiosInstance.post("/chat/send-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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

export const deleteMessage = async (
  messageId: number
): Promise<SingleResponse<void>> => {
  try {
    const res = await axiosInstance.delete(`/chat/${messageId}`);

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

export const reactMessage = async (
  messageId: number,
  type: EReactionType
): Promise<SingleResponse<MessageResponse>> => {
  try {
    const res = await axiosInstance.post("/chat/react", { messageId, type });

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

export const getMessagesByConversation = async (
  conversationId: number
): Promise<BaseResponse<MessageResponse>> => {
  try {
    const res = await axiosInstance.get(`/chat/conversation/${conversationId}`);

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

export const getMyConversations = async (): Promise<
  BaseResponse<ConversationResponse>
> => {
  try {
    const res = await axiosInstance.get("/chat/me");

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
