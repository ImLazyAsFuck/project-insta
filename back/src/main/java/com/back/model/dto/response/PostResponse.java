package com.back.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse{
    private Long id;
    private String content;
    private LocalDateTime createdAt;

    private UserSummaryResponse user;

    private List<PostMediaResponse> mediaList;

    private long totalReactions;
    private long totalComments;

    private boolean reactedByCurrentUser;
}
