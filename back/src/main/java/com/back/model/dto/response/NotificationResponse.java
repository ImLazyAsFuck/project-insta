package com.back.model.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
    private UserSummaryResponse sender;
    private Long conversationId;
}
