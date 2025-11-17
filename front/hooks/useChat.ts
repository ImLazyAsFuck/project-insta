import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendMessage,
  sendMessageMedia,
  deleteMessage,
  reactMessage,
  getMessagesByConversation,
  getMyConversations,
} from "@/services/chat.service";
import { ConversationResponse } from "@/interfaces/chat.interface";
import {
  MessageMediaRequest,
  MessageRequest,
  MessageResponse,
} from "@/interfaces/message.interface";
import { EReactionType } from "@/types/reaction.enum";
import { BaseResponse, SingleResponse } from "@/utils/response-data";

export const CHAT_KEY = ["chat"];

export const useMessagesQuery = (conversationId: number) => {
  return useQuery<BaseResponse<MessageResponse>, Error>({
    queryKey: [...CHAT_KEY, "conversation", conversationId],
    queryFn: () => getMessagesByConversation(conversationId),
    enabled: !!conversationId,
  });
};

export const useMyConversationsQuery = () => {
  return useQuery<BaseResponse<ConversationResponse>, Error>({
    queryKey: [...CHAT_KEY, "me"],
    queryFn: getMyConversations,
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleResponse<MessageResponse>,
    Error,
    MessageRequest
  >({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      if (data.data?.conversationId) {
        queryClient.invalidateQueries({
          queryKey: [...CHAT_KEY, "conversation", data.data.conversationId],
        });
      }
      queryClient.invalidateQueries({ queryKey: [...CHAT_KEY, "me"] });
    },
  });
};

export const useSendMessageMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleResponse<MessageResponse>,
    Error,
    MessageMediaRequest
  >({
    mutationFn: sendMessageMedia,
    onSuccess: (data) => {
      if (data.data?.conversationId) {
        queryClient.invalidateQueries({
          queryKey: [...CHAT_KEY, "conversation", data.data.conversationId],
        });
      }
      queryClient.invalidateQueries({ queryKey: [...CHAT_KEY, "me"] });
    },
  });
};

export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleResponse<void>, Error, number>({
    mutationFn: deleteMessage,
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEY });
    },
  });
};

export const useReactMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleResponse<MessageResponse>,
    Error,
    { messageId: number; type: EReactionType; remove?: boolean }
  >({
    mutationFn: ({ messageId, type, remove }) =>
      reactMessage(messageId, type, remove),
    onSuccess: (data) => {
      if (data.data?.conversationId) {
        queryClient.invalidateQueries({
          queryKey: [...CHAT_KEY, "conversation", data.data.conversationId],
        });
      }
    },
  });
};
