package com.back.model.mapper;

import com.back.model.dto.response.CommentResponse;
import com.back.model.dto.response.UserSummaryResponse;
import com.back.model.entity.Comment;
import com.back.model.entity.User;

import java.util.ArrayList;

public class CommentMapper{
    public static CommentResponse mapToCommentResponse(Comment comment, User currentUser) {
        CommentResponse response = CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(UserSummaryResponse.builder()
                        .id(comment.getUser().getId())
                        .username(comment.getUser().getUsername())
                        .fullName(comment.getUser().getFullName())
                        .avatarUrl(comment.getUser().getAvatarUrl())
                        .build())
                .createdAt(comment.getCreatedAt())
                .reactionCount(comment.getReactions() != null ? comment.getReactions().size() : 0)
                .reactedByCurrentUser(comment.getReactions() != null &&
                        comment.getReactions().stream().anyMatch(r -> r.getUser().getId().equals(currentUser.getId())))
                .replyToUsername(comment.getParentComment() != null ? comment.getParentComment().getUser().getUsername() : null)
                .parentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .childComments(new ArrayList<>())
                .build();

        if (comment.getChildComments() != null) {
            for (Comment child : comment.getChildComments()) {
                response.getChildComments().add(mapToCommentResponse(child, currentUser));
            }
        }

        return response;
    }

}
