package com.back.model.mapper;

import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;
import com.back.model.enums.EFollowStatus;
import com.back.repository.IFollowRepository;
import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
public class BuildProfileResponse{

    private final IFollowRepository followRepository;

    private ProfileResponse buildProfileResponse(User user) {
        long followersCount = followRepository.countByFollowingAndStatus(user, EFollowStatus.ACCEPTED);
        long followingCount = followRepository.countByFollowerAndStatus(user, EFollowStatus.ACCEPTED);
        long postCount = 0;

        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .website(user.getWebsite())
                .bio(user.getBio())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(String.valueOf(user.getGender()))
                .avatarUrl(user.getAvatarUrl())
                .followersCount(followersCount)
                .followingCount(followingCount)
                .postCount(postCount)
                .build();
    }

}
