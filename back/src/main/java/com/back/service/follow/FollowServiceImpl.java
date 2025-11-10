package com.back.service.follow;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.Conversation;
import com.back.model.entity.Follow;
import com.back.model.entity.User;
import com.back.model.enums.EFollowStatus;
import com.back.model.enums.EUserStatus;
import com.back.model.mapper.MapToProfileResponse;
import com.back.repository.IConversationRepository;
import com.back.repository.IFollowRepository;
import com.back.repository.IUserRepository;
import com.back.security.principal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements IFollowService {

    private final IFollowRepository followRepository;
    private final IUserRepository userRepository;
    private final IConversationRepository conversationRepository;

    @Override
    public APIResponse<Void> followUser(Long followingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User follower = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng để theo dõi"));

        if (follower.getId().equals(followingId)) {
            throw new IllegalArgumentException("Không thể theo dõi chính mình");
        }

        Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowing(follower, following);
        if (existingFollow.isPresent() && existingFollow.get().getStatus() == EFollowStatus.PENDING) {
            throw new IllegalArgumentException("Bạn đã gửi yêu cầu theo dõi người dùng này rồi");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .status(EFollowStatus.PENDING)
                .build();

        followRepository.save(follow);

        return APIResponse.<Void>builder()
                .message("Đã gửi yêu cầu theo dõi")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<Void> acceptFollow(Long followerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerId, userDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy yêu cầu theo dõi"));

        if (!follow.getFollowing().getId().equals(userDetails.getId())) {
            throw new SecurityException("Bạn không có quyền chấp nhận yêu cầu này");
        }

        if (follow.getStatus() != EFollowStatus.PENDING) {
            throw new IllegalArgumentException("Yêu cầu theo dõi này đã được xử lý");
        }

        follow.setStatus(EFollowStatus.ACCEPTED);
        followRepository.save(follow);

        Optional<Conversation> existingConversation = conversationRepository
                .findConversationByParticipants(follow.getFollower().getId(), follow.getFollowing().getId());

        if (existingConversation.isEmpty()) {
            Conversation conversation = Conversation.builder()
                    .participants(List.of(follow.getFollower(), follow.getFollowing()))
                    .createdAt(LocalDateTime.now())
                    .build();
            conversationRepository.save(conversation);
        }

        return APIResponse.<Void>builder()
                .message("Đã chấp nhận yêu cầu theo dõi")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<Void> declineFollow(Long followerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerId, userDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy yêu cầu theo dõi"));

        if (!follow.getFollowing().getId().equals(userDetails.getId())) {
            throw new SecurityException("Bạn không có quyền từ chối yêu cầu này");
        }

        if (follow.getStatus() != EFollowStatus.PENDING) {
            throw new IllegalArgumentException("Yêu cầu theo dõi này đã được xử lý");
        }

        followRepository.delete(follow);

        return APIResponse.<Void>builder()
                .message("Đã từ chối yêu cầu theo dõi")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<Void> removeFollow(Long followId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User currentUser = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Follow follow = followRepository.findByFollowerIdAndFollowingId(currentUser.getId(), followId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy mối quan hệ theo dõi"));

        followRepository.delete(follow);

        return APIResponse.<Void>builder()
                .message("Đã hủy theo dõi")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<List<ProfileResponse>> getFollowRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<ProfileResponse> requests = followRepository
                .findByFollowingAndStatus(currentUser, EFollowStatus.PENDING)
                .stream()
                .map(Follow::getFollower)
                .map(MapToProfileResponse::mapToProfileResponse)
                .collect(Collectors.toList());

        return APIResponse.<List<ProfileResponse>>builder()
                .data(requests)
                .message("Danh sách yêu cầu theo dõi")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<List<ProfileResponse>> getFollowers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<ProfileResponse> followers = followRepository
                .findByFollowingAndStatus(currentUser, EFollowStatus.ACCEPTED)
                .stream()
                .map(Follow::getFollower)
                .map(MapToProfileResponse::mapToProfileResponse)
                .collect(Collectors.toList());

        return APIResponse.<List<ProfileResponse>>builder()
                .data(followers)
                .message("Danh sách người theo dõi")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<List<ProfileResponse>> getFollowing() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<ProfileResponse> following = followRepository
                .findByFollowerAndStatus(currentUser, EFollowStatus.ACCEPTED)
                .stream()
                .map(Follow::getFollowing)
                .map(MapToProfileResponse::mapToProfileResponse)
                .collect(Collectors.toList());

        return APIResponse.<List<ProfileResponse>>builder()
                .data(following)
                .message("Danh sách đang theo dõi")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<EFollowStatus> getFollowStatus(Long targetId) {
        CustomUserDetails currentUser = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long currentUserId = currentUser.getId();

        return followRepository.findByFollowerIdAndFollowingId(currentUserId, targetId)
                .map(follow -> APIResponse.<EFollowStatus>builder()
                        .data(follow.getStatus())
                        .message("Follow status fetched successfully")
                        .build())
                .orElse(APIResponse.<EFollowStatus>builder()
                        .data(null)
                        .message("Không tìm thấy quan hệ")
                        .build());
    }
}
