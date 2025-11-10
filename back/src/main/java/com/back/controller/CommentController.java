package com.back.controller;

import com.back.model.dto.request.CommentRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.CommentResponse;
import com.back.service.comment.ICommentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Comment", description = "API bình luận")
public class CommentController{

    private final ICommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<APIResponse<List<CommentResponse>>> getCommentsByPostId(@PathVariable Long postId) {
        APIResponse<List<CommentResponse>> response = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<APIResponse<CommentResponse>> createComment(@RequestBody CommentRequest request) {
        APIResponse<CommentResponse> response = commentService.createComment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<APIResponse<Void>> deleteComment(@PathVariable Long commentId) {
        APIResponse<Void> response = commentService.deleteComment(commentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{commentId}/reaction")
    public ResponseEntity<APIResponse<Void>> toggleCommentReaction(@PathVariable Long commentId) {
        APIResponse<Void> response = commentService.toggleCommentReaction(commentId);
        return ResponseEntity.ok(response);
    }
}
