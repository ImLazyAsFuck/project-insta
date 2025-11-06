package com.back.service.block;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;

import java.util.List;

public interface IBlockService{
    APIResponse<Void> blockUser(Long userId);
    APIResponse<Void> unblockUser(Long userId);
    APIResponse<List<ProfileResponse>> getBlockedUsers();
}
