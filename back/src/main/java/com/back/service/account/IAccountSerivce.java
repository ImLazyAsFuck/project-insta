package com.back.service.account;

import com.back.model.dto.request.ChangePasswordRequest;
import com.back.model.dto.request.ProfileRequestDTO;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface IAccountSerivce{
    APIResponse<ProfileResponse> getProfile();
    APIResponse<ProfileResponse> updateProfileInfo(ProfileRequestDTO profileRequest);
    APIResponse<ProfileResponse> updateAvatar(MultipartFile avatar);
    APIResponse<Void> changePassword(ChangePasswordRequest request);
}
