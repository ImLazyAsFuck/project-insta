package com.back.service.auth;

import com.back.model.dto.request.LoginRequest;
import com.back.model.dto.request.RegisterRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.JWTResponse;

public interface IAuthService{
    APIResponse<JWTResponse> login(LoginRequest loginRequest);
    APIResponse<JWTResponse> register(RegisterRequest registerRequest);
    APIResponse<JWTResponse> refreshToken(String refreshToken);
    APIResponse<Void> logout();
}