package com.back.service.friend;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;

import java.util.List;

public interface IFriendService {

    APIResponse<ProfileResponse> findProfileByPhone(Long userId, String phoneNumber);

    APIResponse<Void> sendFriendRequest(Long fromUserId, Long toUserId);

    APIResponse<Void> acceptFriendRequest(Long requestId);

    APIResponse<Void> rejectFriendRequest(Long requestId);

    APIResponse<List<ProfileResponse>> getFriendRequests(Long userId);

    APIResponse<List<ProfileResponse>> getFriends(Long userId);

    APIResponse<Void> blockUser(Long userId, Long targetUserId);

    APIResponse<Void> unblockUser(Long userId, Long targetUserId);
}
