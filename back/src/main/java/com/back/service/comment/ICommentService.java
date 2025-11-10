package com.back.service.comment;

import com.back.model.dto.request.CommentRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.CommentResponse;

import java.util.List;

public interface ICommentService{
    APIResponse<List<CommentResponse>> getCommentsByPostId(Long postId);
    APIResponse<CommentResponse> createComment(CommentRequest commentRequest);
    APIResponse<Void> deleteComment(Long commentId);
    APIResponse<Void> toggleCommentReaction(Long commentId);
}
