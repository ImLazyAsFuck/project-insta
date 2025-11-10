package com.back.service.user;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;
import com.back.model.enums.EFollowStatus;
import com.back.model.enums.EUserStatus;
import com.back.model.mapper.MapToProfileResponse;
import com.back.repository.*;
import com.back.security.principal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService{

    private final IUserRepository userRepository;
    private final IBlockedUserRepository blockedUserRepository;
    private final IFollowRepository followRepository;
    private final IPostRepository postRepository;

    @Override
    public APIResponse<List<ProfileResponse>> searchByUsername(String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<ProfileResponse> result = userRepository.findByUsernameContainingIgnoreCase(username)
                .stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .filter(u -> u.getStatus() == EUserStatus.ACTIVE)
                .filter(u -> !blockedUserRepository.existsByUserAndBlockedUser(currentUser, u))
                .filter(u -> !blockedUserRepository.existsByUserAndBlockedUser(u, currentUser))
                .map(MapToProfileResponse::mapToProfileResponse)
                .collect(Collectors.toList());

        return APIResponse.<List<ProfileResponse>>builder()
                .data(result)
                .message("Kết quả tìm kiếm")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<ProfileResponse> getProfileByUsername(String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails currentUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng hiện tại"));

        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với username: " + username));

        boolean isBlockedByMe = blockedUserRepository.existsByUserAndBlockedUser(currentUser, targetUser);
        boolean isBlockedByTarget  = blockedUserRepository.existsByUserAndBlockedUser(targetUser, currentUser);

        if (isBlockedByTarget ) {
            throw new IllegalStateException("Không thể xem hồ sơ này (bạn đã bị chặn).");
        }

        if (isBlockedByMe) {
            ProfileResponse blockedProfile = ProfileResponse.builder()
                    .id(targetUser.getId())
                    .username(targetUser.getUsername())
                    .avatarUrl(targetUser.getAvatarUrl())

                    .isBlockedByTarget(true)
                    .isBlockedByMe(false)
                    .isBlocked(true)

                    .build();

            return APIResponse.<ProfileResponse>builder()
                    .data(blockedProfile)
                    .message("Đang hiển thị thông tin tối giản do bạn đã chặn người này.")
                    .status(200)
                    .build();
        }

        long postCount = postRepository.countPostsByUser(targetUser);

        boolean isFollowing = followRepository.existsByFollowerAndFollowing(currentUser, targetUser);
        long followerCount = followRepository.countByFollowingAndStatus(targetUser, EFollowStatus.ACCEPTED);
        long followingCount = followRepository.countByFollowingAndStatus(targetUser, EFollowStatus.ACCEPTED);

        ProfileResponse profile = MapToProfileResponse.mapToProfileResponse(targetUser);
        profile.setFollowersCount(followerCount);
        profile.setFollowingCount(followingCount);
        profile.setIsBlockedByMe(isBlockedByMe);
        profile.setIsBlockedByTarget(isBlockedByTarget);
        profile.setPostCount(postCount);

        return APIResponse.<ProfileResponse>builder()
                .data(profile)
                .message("Lấy thông tin người dùng thành công")
                .status(200)
                .build();
    }
}
