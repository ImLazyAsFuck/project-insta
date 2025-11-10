package com.back.service.chat;

import com.back.model.dto.request.MessageRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.MessageResponse;
import com.back.model.enums.EReactionType;

import java.util.List;

public interface IChatService{

    APIResponse<MessageResponse> sendMessage(MessageRequest request);

    APIResponse<Void> deleteMessage(Long messageId);

    APIResponse<MessageResponse> reactMessage(Long messageId, EReactionType type);

    APIResponse<List<MessageResponse>> getMyMessages();

    APIResponse<List<MessageResponse>> getMessagesByConversation(Long conversationId);
}
