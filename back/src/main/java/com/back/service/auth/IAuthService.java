package com.back.service.auth;

import com.back.model.dto.request.LoginRequestDTO;
import com.back.model.dto.request.ProfileRequestDTO;
import com.back.model.dto.request.RegisterRequestDTO;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.JWTResponse;
import com.back.model.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface IAuthService{
    APIResponse<JWTResponse> login(LoginRequestDTO loginRequestDTO);
    APIResponse<JWTResponse> register(RegisterRequestDTO registerRequestDTO);
    APIResponse<JWTResponse> refreshToken(String refreshToken);
    APIResponse<Void> logout();
}