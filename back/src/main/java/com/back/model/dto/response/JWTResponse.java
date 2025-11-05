package com.back.model.dto.response;

import com.back.model.enums.EUserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JWTResponse {
    private String accessToken;
    private String refreshToken;

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String website;
    private String phoneNumber;
    private String avatarUrl;
    private EUserStatus status;
}
