package com.back.service.block;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.BlockedUser;
import com.back.model.entity.User;
import com.back.repository.IBlockedUserRepository;
import com.back.repository.IFollowRepository;
import com.back.repository.IUserRepository;
import com.back.security.principal.CustomUserDetails;
import com.back.service.block.IBlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class BlockServiceImpl implements IBlockService{

    private final IUserRepository userRepository;
    private final IBlockedUserRepository blockedUserRepository;
    private final IFollowRepository followRepository;

    @Override
    public APIResponse<Void> blockUser(Long userId) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User blocker = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        User blocked = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng để chặn"));

        if (blocker.getId().equals(blocked.getId())) {
            return APIResponse.<Void>builder()
                    .status(400)
                    .message("Không thể tự chặn chính mình")
                    .build();
        }

        if (blockedUserRepository.existsByUserAndBlockedUser(blocked, blocker)) {
            return APIResponse.<Void>builder()
                    .status(403)
                    .message("Người này đã chặn bạn, không thể chặn ngược lại")
                    .build();
        }

        if (blockedUserRepository.existsByUserAndBlockedUser(blocker, blocked)) {
            return APIResponse.<Void>builder()
                    .status(400)
                    .message("Bạn đã chặn người này trước đó")
                    .build();
        }

        followRepository.deleteByFollowerAndFollowing(blocker, blocked);
        followRepository.deleteByFollowerAndFollowing(blocked, blocker);

        blockedUserRepository.save(BlockedUser.builder()
                .user(blocker)
                .blockedUser(blocked)
                .build());

        return APIResponse.<Void>builder()
                .status(200)
                .message("Đã chặn người dùng")
                .build();
    }

    @Override
    public APIResponse<Void> unblockUser(Long userId) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User blocker = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        User blocked = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng để bỏ chặn"));

        BlockedUser blockedUser = blockedUserRepository
                .findByUserAndBlockedUser(blocker, blocked)
                .orElse(null);

        if (blockedUser == null) {
            return APIResponse.<Void>builder()
                    .status(400)
                    .message("Người dùng chưa bị chặn")
                    .build();
        }

        blockedUserRepository.delete(blockedUser);

        return APIResponse.<Void>builder()
                .status(200)
                .message("Đã bỏ chặn người dùng")
                .build();
    }

    @Override
    public APIResponse<List<ProfileResponse>> getBlockedUsers() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User blocker = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<BlockedUser> blockedList = blockedUserRepository.findAllByUser(blocker);

        List<ProfileResponse> blockedProfiles = blockedList.stream()
                .map(b -> ProfileResponse.builder()
                        .id(b.getBlockedUser().getId())
                        .username(b.getBlockedUser().getUsername())
                        .fullName(b.getBlockedUser().getFullName())
                        .avatarUrl(b.getBlockedUser().getAvatarUrl())
                        .status(b.getBlockedUser().getStatus().name())
                        .build())
                .toList();

        return APIResponse.<List<ProfileResponse>>builder()
                .status(200)
                .message("Danh sách người dùng đã chặn")
                .data(blockedProfiles)
                .build();
    }

}
