package com.back.model.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse{
    private Long id;
    private Long conversationId;
    private UserSummaryResponse sender;
    private String content;
    private List<String> mediaUrls;
    private LocalDateTime createdAt;
    private List<MessageReactionResponse> reactions;
}
