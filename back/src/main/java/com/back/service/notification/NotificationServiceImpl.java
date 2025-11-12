package com.back.service.notification;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.NotificationResponse;
import com.back.model.dto.response.UserSummaryResponse;
import com.back.model.entity.Notification;
import com.back.model.entity.User;
import com.back.repository.INotificationRepository;
import com.back.repository.IUserRepository;
import com.back.security.principal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements INotificationService {

    private final INotificationRepository notificationRepository;
    private final IUserRepository userRepository;

    @Override
    public APIResponse<List<NotificationResponse>> getNotifications() {
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (currentUserDetails == null) {
            throw new NoSuchElementException("Không tìm thấy người dùng");
        }

        User receiver = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Người dùng không tồn tại"));

        List<Notification> notifications = notificationRepository.findByReceiverOrderByCreatedAtDesc(receiver);

        List<NotificationResponse> responseList = notifications.stream()
                .map(n -> {
                    List<User> participants = n.getConversation().getParticipants();

                    User opponent = participants.stream()
                            .filter(u -> !u.getId().equals(receiver.getId()))
                            .findFirst()
                            .orElse(n.getSender());

                    String message = "Bạn đã nhận được tin nhắn từ " + opponent.getFullName();

                    return NotificationResponse.builder()
                            .id(n.getId())
                            .message(message)
                            .isRead(n.isRead())
                            .createdAt(n.getCreatedAt())
                            .sender(UserSummaryResponse.builder()
                                    .id(opponent.getId())
                                    .username(opponent.getUsername())
                                    .fullName(opponent.getFullName())
                                    .avatarUrl(opponent.getAvatarUrl())
                                    .build())
                            .conversationId(n.getConversation().getId())
                            .build();
                })
                .collect(Collectors.toList());

        return APIResponse.<List<NotificationResponse>>builder()
                .message("Lấy danh sách thông báo thành công")
                .data(responseList)
                .build();
    }
}
