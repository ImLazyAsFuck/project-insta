package com.back.service.User;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;

import java.util.List;

public interface IUserService{
    APIResponse<List<ProfileResponse>> searchByUsername(String username);
    APIResponse<ProfileResponse> getProfileByUsername(String username);
}
