package com.back.service.follow;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;
import com.back.model.enums.EFollowStatus;

import java.util.List;

public interface IFollowService{
    APIResponse<Void> followUser(Long followingId);
    APIResponse<Void> acceptFollow(Long followId);
    APIResponse<Void> declineFollow(Long followId);
    APIResponse<Void> removeFollow(Long followId);
    APIResponse<List<ProfileResponse>> getFollowRequests();
    APIResponse<List<ProfileResponse>> getFollowers();
    APIResponse<List<ProfileResponse>> getFollowing();
    APIResponse<EFollowStatus> getFollowStatus(Long targetId);
}
