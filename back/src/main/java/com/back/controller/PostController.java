package com.back.controller;

import com.back.model.dto.request.PostRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.PostResponse;
import com.back.model.enums.EVisibility;
import com.back.service.post.IPostService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/posts")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Post", description = "API bài đăng")
public class PostController{

    private final IPostService postService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<APIResponse<PostResponse>> createPost(
            @ModelAttribute PostRequest postRequest
    ) {
        APIResponse<PostResponse> response = postService.createPost(postRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/feeds")
    public ResponseEntity<APIResponse<List<PostResponse>>> getFeeds() {
        APIResponse<List<PostResponse>> response = postService.getFeeds();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<APIResponse<List<PostResponse>>> getOwnPosts() {
        APIResponse<List<PostResponse>> response = postService.getOwnPosts();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{postId}/visibility")
    public ResponseEntity<APIResponse<PostResponse>> changeVisibility(
            @PathVariable Long postId,
            @RequestParam EVisibility visibility) {
        APIResponse<PostResponse> response = postService.changePostVisibility(postId, visibility);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{postId}/reaction")
    public ResponseEntity<APIResponse<Void>> toggleReaction(@PathVariable Long postId) {
        APIResponse<Void> response = postService.togglePostReaction(postId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/other/{userId}")
    public ResponseEntity<APIResponse<List<PostResponse>>> getOtherPosts(@PathVariable Long userId){
        APIResponse<List<PostResponse>> response = postService.getOtherPosts(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<APIResponse<PostResponse>> getPostById(@PathVariable Long postId){
        APIResponse<PostResponse> response = postService.getPostById(postId);
        return ResponseEntity.ok(response);
    }
}
