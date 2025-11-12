package com.back.controller;

import com.back.model.dto.request.MessageRequest;
import com.back.model.dto.request.MessageMediaRequest;
import com.back.model.dto.response.*;
import com.back.model.enums.EReactionType;
import com.back.service.chat.IChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final IChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send")
    public ResponseEntity<APIResponse<MessageResponse>> sendMessage(
            @RequestBody MessageRequest request
    ) {
        APIResponse<MessageResponse> response = chatService.sendMessage(request);

        messagingTemplate.convertAndSend(
                "/topic/conversation/" + request.getConversationId(),
                response.getData()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(value = "/send-media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<MessageResponse>> sendMedia(
            @ModelAttribute @Valid MessageMediaRequest request
    ) {

        APIResponse<MessageResponse> response = chatService.sendMedia(request);

        messagingTemplate.convertAndSend(
                "/topic/conversation/" + request.getConversationId(),
                response.getData()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<APIResponse<List<MessageResponse>>> getMessagesByConversation(
            @PathVariable Long conversationId
    ) {
        APIResponse<List<MessageResponse>> response = chatService.getMessagesByConversation(conversationId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/react")
    public ResponseEntity<APIResponse<MessageResponse>> reactMessage(
            @RequestParam Long messageId,
            @RequestParam EReactionType type
    ) {
        APIResponse<MessageResponse> response = chatService.reactMessage(messageId, type);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<APIResponse<Void>> deleteMessage(@PathVariable Long messageId) {
        APIResponse<Void> response = chatService.deleteMessage(messageId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<APIResponse<List<ConversationResponse>>> getMyConversation() {
        APIResponse<List<ConversationResponse>> response = chatService.getMyConversations();
        return ResponseEntity.ok(response);
    }
}
