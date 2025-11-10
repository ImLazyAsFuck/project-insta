package com.back.service.chat;

import com.back.model.dto.request.MessageRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.MessageReactionResponse;
import com.back.model.dto.response.MessageResponse;
import com.back.model.dto.response.UserSummaryResponse;
import com.back.model.entity.*;
import com.back.model.enums.EReactionType;
import com.back.repository.*;
import com.back.security.principal.CustomUserDetails;
import com.back.service.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements IChatService {

    private final IMessageRepository messageRepository;
    private final IMessageMediaRepository mediaRepository;
    private final IConversationRepository conversationRepository;
    private final IUserRepository userRepository;
    private final IMessageReactionRepository reactionRepository;
    private final CloudinaryService cloudinaryService;


    @Override
    public APIResponse<MessageResponse> sendMessage(MessageRequest request){
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy hộp thoại"));

        Message message = Message.builder()
                .content(request.getContent())
                .sender(sender)
                .conversation(conversation)
                .createdAt(LocalDateTime.now())
                .build();

        messageRepository.save(message);

        if (request.getMedia() != null && !request.getMedia().isEmpty()) {
            List<MessageMedia> mediaList = request.getMedia().stream().map(file -> {
                try {
                    String uploadedUrl;
                    String type;
                    if (file.getContentType() != null && file.getContentType().startsWith("video")) {
                        uploadedUrl = cloudinaryService.uploadVideo(file);
                        type = "video";
                    } else {
                        uploadedUrl = cloudinaryService.uploadImage(file);
                        type = "image";
                    }
                    return MessageMedia.builder()
                            .url(uploadedUrl)
                            .type(type)
                            .message(message)
                            .build();
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload media: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());

            mediaRepository.saveAll(mediaList);
            message.setMediaList(mediaList);
        }

        MessageResponse messageResponse = MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .conversationId(message.getConversation().getId())
                .sender(UserSummaryResponse.builder()
                        .id(message.getSender().getId())
                        .username(message.getSender().getUsername())
                        .fullName(message.getSender().getFullName())
                        .avatarUrl(message.getSender().getAvatarUrl())
                        .build())
                .mediaUrls(message.getMediaList().stream().map(MessageMedia::getUrl).toList())
                .reactions(List.of())
                .build();

        return APIResponse.<MessageResponse>builder()
                .message("Gửi tin nhắn thành công")
                .data(messageResponse)
                .build();
    }

    @Override
    public APIResponse<Void> deleteMessage(Long messageId){
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tin nhắn"));
        messageRepository.delete(message);
        return APIResponse.<Void>builder()
                .message("Xóa tin nhắn thành công")
                .build();
    }

    @Override
    public APIResponse<MessageResponse> reactMessage(Long messageId, EReactionType type){
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tin nhắn"));

        MessageReaction reaction = MessageReaction.builder()
                .message(message)
                .user(user)
                .type(type)
                .createdAt(LocalDateTime.now())
                .build();

        reactionRepository.save(reaction);
        MessageResponse messageResponse = MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .conversationId(message.getConversation().getId())
                .sender(UserSummaryResponse.builder()
                        .id(message.getSender().getId())
                        .username(message.getSender().getUsername())
                        .fullName(message.getSender().getFullName())
                        .avatarUrl(message.getSender().getAvatarUrl())
                        .build())
                .mediaUrls(message.getMediaList() != null ? message.getMediaList().stream().map(MessageMedia::getUrl).toList() : List.of())
                .reactions(message.getReactions() != null ? message.getReactions().stream().map(r ->
                        MessageReactionResponse.builder()
                                .id(r.getId())
                                .userId(r.getUser().getId())
                                .username(r.getUser().getUsername())
                                .type(r.getType())
                                .build()).toList() : List.of())
                .build();


        return APIResponse.<MessageResponse>builder()
                .message("Thả reaction thành công")
                .data(messageResponse)
                .build();
    }

    @Override
    public APIResponse<List<MessageResponse>> getMyMessages() {
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<MessageResponse> messages = messageRepository.findBySender(user).stream()
                .map(message -> MessageResponse.builder()
                        .id(message.getId())
                        .content(message.getContent())
                        .createdAt(message.getCreatedAt())
                        .conversationId(message.getConversation().getId())
                        .sender(UserSummaryResponse.builder()
                                .id(message.getSender().getId())
                                .username(message.getSender().getUsername())
                                .fullName(message.getSender().getFullName())
                                .avatarUrl(message.getSender().getAvatarUrl())
                                .build())
                        .mediaUrls(message.getMediaList() != null ? message.getMediaList().stream().map(MessageMedia::getUrl).toList() : List.of())
                        .reactions(message.getReactions() != null ? message.getReactions().stream().map(r ->
                                MessageReactionResponse.builder()
                                        .id(r.getId())
                                        .userId(r.getUser().getId())
                                        .username(r.getUser().getUsername())
                                        .type(r.getType())
                                        .build()).toList() : List.of())
                        .build())
                .toList();

        return APIResponse.<List<MessageResponse>>builder()
                .message("Lấy tin nhắn của bạn thành công")
                .data(messages)
                .build();
    }

    @Override
    public APIResponse<List<MessageResponse>> getMessagesByConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy hộp thoại"));

        List<MessageResponse> messages = conversation.getMessages().stream()
                .sorted((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()))
                .map(message -> MessageResponse.builder()
                        .id(message.getId())
                        .content(message.getContent())
                        .createdAt(message.getCreatedAt())
                        .conversationId(message.getConversation().getId())
                        .sender(UserSummaryResponse.builder()
                                .id(message.getSender().getId())
                                .username(message.getSender().getUsername())
                                .fullName(message.getSender().getFullName())
                                .avatarUrl(message.getSender().getAvatarUrl())
                                .build())
                        .mediaUrls(message.getMediaList() != null ? message.getMediaList().stream().map(MessageMedia::getUrl).toList() : List.of())
                        .reactions(message.getReactions() != null ? message.getReactions().stream().map(r ->
                                MessageReactionResponse.builder()
                                        .id(r.getId())
                                        .userId(r.getUser().getId())
                                        .username(r.getUser().getUsername())
                                        .type(r.getType())
                                        .build()).toList() : List.of())
                        .build())
                .toList();

        return APIResponse.<List<MessageResponse>>builder()
                .message("Lấy tin nhắn hộp thoại thành công")
                .data(messages)
                .build();
    }
}
