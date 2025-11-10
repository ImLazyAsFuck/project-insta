import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendMessage,
  deleteMessage,
  reactMessage,
  getMessagesByConversation,
  getMyMessages,
} from "@/services/chat.service";
import {
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

export const useMyMessagesQuery = () => {
  return useQuery<BaseResponse<MessageResponse>, Error>({
    queryKey: [...CHAT_KEY, "me"],
    queryFn: getMyMessages,
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleResponse<MessageResponse>, Error, MessageRequest>({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      if (data.data?.conversationId) {
        queryClient.invalidateQueries({
          queryKey: [...CHAT_KEY, "conversation", data.data.conversationId],
        });
      }
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
    { messageId: number; type: EReactionType }
  >({
    mutationFn: ({ messageId, type }) => reactMessage(messageId, type),
    onSuccess: (data) => {
      if (data.data?.conversationId) {
        queryClient.invalidateQueries({
          queryKey: [...CHAT_KEY, "conversation", data.data.conversationId],
        });
      }
    },
  });
};
