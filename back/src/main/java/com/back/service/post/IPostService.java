package com.back.service.post;

import com.back.model.dto.request.PostRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.PostResponse;
import com.back.model.enums.EVisibility;

import java.util.List;

public interface IPostService{
    APIResponse<PostResponse> createPost(PostRequest request);
    APIResponse<List<PostResponse>> getFeeds();
    APIResponse<List<PostResponse>> getOwnPosts();
    APIResponse<List<PostResponse>> getOtherPosts(long userId);
    APIResponse<PostResponse> changePostVisibility(Long postId, EVisibility visibility);
    APIResponse<Void> togglePostReaction(Long postId);
    APIResponse<PostResponse> getPostById(Long postId);
}
