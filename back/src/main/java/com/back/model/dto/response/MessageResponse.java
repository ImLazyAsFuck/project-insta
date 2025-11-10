package com.back.model.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String content;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private List<Long> seenBy;
    private List<MessageReactionDTO> reactions;
}
