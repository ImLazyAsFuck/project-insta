package com.back.model.mapper;

import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;

public class MapToProfileResponse{
    public static ProfileResponse mapToProfileResponse(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .website(user.getWebsite())
                .bio(user.getBio())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .build();
    }
}
