package com.back.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CommentResponse{
    private Long id;
    private String content;
    private UserSummaryResponse user;
    private String replyToUsername;
    private Long parentId;
    private int reactionCount;
    private boolean reactedByCurrentUser;
    private LocalDateTime createdAt;
    private List<CommentResponse> childComments;
}
