package com.back.service.chat;

import com.back.model.dto.request.MessageMediaRequest;
import com.back.model.dto.request.MessageRequest;
import com.back.model.dto.response.*;
import com.back.model.entity.*;
import com.back.model.enums.EReactionType;
import com.back.repository.*;
import com.back.security.principal.CustomUserDetails;
import com.back.service.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
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
    private final INotificationRepository notificationRepository;

    @Override
    @Transactional
    public APIResponse<MessageResponse> sendMessage(MessageRequest request) {
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

        sendMessageNotifications(conversation, sender);

        MessageResponse messageResponse = toMessageResponse(message);

        return APIResponse.<MessageResponse>builder()
                .message("Gửi tin nhắn thành công")
                .data(messageResponse)
                .build();
    }

    @Override
    @Transactional
    public APIResponse<MessageResponse> sendMedia(MessageMediaRequest request) {
        if (request.getMediaFiles() == null || request.getMediaFiles().isEmpty()) {
            throw new IllegalArgumentException("Danh sách media không được rỗng");
        }

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy hộp thoại"));

        Message message = Message.builder()
                .content(null)
                .sender(sender)
                .conversation(conversation)
                .createdAt(LocalDateTime.now())
                .build();
        messageRepository.save(message);

        List<MessageMedia> mediaList = request.getMediaFiles().stream()
                .map(file -> {
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
                        throw new RuntimeException("Lỗi upload media: " + file.getOriginalFilename(), e);
                    }
                })
                .collect(Collectors.toList());

        mediaRepository.saveAll(mediaList);
        message.setMediaList(mediaList);
        messageRepository.save(message);

        sendMessageNotifications(conversation, sender);

        MessageResponse messageResponse = toMessageResponse(message);

        return APIResponse.<MessageResponse>builder()
                .message("Gửi media thành công")
                .data(messageResponse)
                .build();
    }

    private void sendMessageNotifications(Conversation conversation, User sender) {
        List<Notification> notifications = conversation.getParticipants().stream()
                .filter(u -> !u.getId().equals(sender.getId()))
                .map(receiver -> Notification.builder()
                        .message(sender.getFullName() + " đã gửi một tin nhắn mới")
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .sender(sender)
                        .receiver(receiver)
                        .conversation(conversation)
                        .build())
                .toList();
        notificationRepository.saveAll(notifications);
    }

    private MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
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
                .mediaUrls(Optional.ofNullable(message.getMediaList())
                        .orElse(List.of())
                        .stream()
                        .map(MessageMedia::getUrl)
                        .toList())
                .reactions(List.of())
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
    @Transactional
    public APIResponse<MessageResponse> reactMessage(Long messageId, EReactionType type) {
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tin nhắn"));

        Optional<MessageReaction> existingReactionOpt =
                reactionRepository.findByMessageAndUser(message, user);

        if (existingReactionOpt.isPresent()) {
            MessageReaction existingReaction = existingReactionOpt.get();

            if (existingReaction.getType() == type) {
                reactionRepository.delete(existingReaction);
            } else {
                existingReaction.setType(type);
                existingReaction.setCreatedAt(LocalDateTime.now());
                reactionRepository.save(existingReaction);
            }
        } else {
            MessageReaction newReaction = MessageReaction.builder()
                    .message(message)
                    .user(user)
                    .type(type)
                    .createdAt(LocalDateTime.now())
                    .build();
            reactionRepository.save(newReaction);
        }

        message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tin nhắn"));

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
                .mediaUrls(message.getMediaList() != null
                        ? message.getMediaList().stream().map(MessageMedia::getUrl).toList()
                        : List.of())
                .reactions(message.getReactions() != null
                        ? message.getReactions().stream().map(r ->
                        MessageReactionResponse.builder()
                                .id(r.getId())
                                .userId(r.getUser().getId())
                                .username(r.getUser().getUsername())
                                .type(r.getType())
                                .build()).toList()
                        : List.of())
                .build();

        return APIResponse.<MessageResponse>builder()
                .message("Cập nhật reaction thành công")
                .data(messageResponse)
                .build();
    }


    @Override
    public APIResponse<List<ConversationResponse>> getMyConversations(){
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication()
                .getPrincipal();

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<Conversation> conversations = conversationRepository.findByParticipantsContaining(currentUser);

        List<ConversationResponse> responses = conversations.stream()
                .map(conversation -> {
                    List<UserSummaryResponse> participants = conversation.getParticipants().stream()
                            .map(u -> UserSummaryResponse.builder()
                                    .id(u.getId())
                                    .username(u.getUsername())
                                    .fullName(u.getFullName())
                                    .avatarUrl(u.getAvatarUrl())
                                    .build())
                            .toList();

                    List<Message> sortedMessages = conversation.getMessages().stream()
                            .sorted((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()))
                            .toList();

                    List<MessageResponse> messageResponses = sortedMessages.stream()
                            .map(m -> MessageResponse.builder()
                                    .id(m.getId())
                                    .conversationId(conversation.getId())
                                    .sender(UserSummaryResponse.builder()
                                            .id(m.getSender().getId())
                                            .username(m.getSender().getUsername())
                                            .fullName(m.getSender().getFullName())
                                            .avatarUrl(m.getSender().getAvatarUrl())
                                            .build())
                                    .content(m.getContent())
                                    .mediaUrls(Optional.ofNullable(m.getMediaList())
                                            .orElse(List.of())
                                            .stream()
                                            .map(MessageMedia::getUrl)
                                            .toList())
                                    .createdAt(m.getCreatedAt())
                                    .reactions(m.getReactions() != null ? m.getReactions().stream()
                                            .map(r -> MessageReactionResponse.builder()
                                                    .id(r.getId())
                                                    .userId(r.getUser().getId())
                                                    .username(r.getUser().getUsername())
                                                    .type(r.getType())
                                                    .build())
                                            .toList() : List.of())
                                    .build())
                            .toList();

                    return ConversationResponse.builder()
                            .id(conversation.getId())
                            .createdAt(conversation.getCreatedAt())
                            .participants(participants)
                            .messages(messageResponses)
                            .build();
                })
                .sorted((c1, c2) -> {
                    LocalDateTime last1 = c1.getMessages().isEmpty()
                            ? c1.getCreatedAt()
                            : c1.getMessages().getLast().getCreatedAt();
                    LocalDateTime last2 = c2.getMessages().isEmpty()
                            ? c2.getCreatedAt()
                            : c2.getMessages().getLast().getCreatedAt();
                    return last2.compareTo(last1);
                })
                .toList();
        return APIResponse.<List<ConversationResponse>>builder()
                .message("Lấy danh sách hội thoại thành công")
                .data(responses)
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
