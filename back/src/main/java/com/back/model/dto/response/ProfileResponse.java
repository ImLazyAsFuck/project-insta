package com.back.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse{
    private Long id;
    private String fullName;
    private String username;
    private String website;
    private String bio;
    private String email;
    private String phoneNumber;
    private String gender;
    private String avatarUrl;
    private String status;

    private Long followersCount;
    private Long followingCount;
    private Long postCount;
}
