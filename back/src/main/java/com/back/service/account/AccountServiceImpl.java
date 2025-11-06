package com.back.service.account;

import com.back.model.dto.request.ChangePasswordRequest;
import com.back.model.dto.request.ProfileRequestDTO;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;
import com.back.model.enums.EFollowStatus;
import com.back.model.enums.EGender;
import com.back.repository.IFollowRepository;
import com.back.repository.IUserRepository;
import com.back.security.principal.CustomUserDetails;
import com.back.service.cloudinary.CloudinaryService;
import com.back.service.refreshtoken.IRefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements IAccountSerivce{

    private final IUserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;
    private final IFollowRepository followRepository;

    @Override
    public APIResponse<ProfileResponse> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        long followersCount = followRepository.countByFollowingAndStatus(user, EFollowStatus.ACCEPTED);
        long followingCount = followRepository.countByFollowerAndStatus(user, EFollowStatus.ACCEPTED);

        long postCount = 0;

        ProfileResponse profileResponse = ProfileResponse.builder()
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

        return APIResponse.<ProfileResponse>builder()
                .data(profileResponse)
                .message("Lấy thông tin cá nhân thành công")
                .status(HttpStatus.OK.value())
                .build();
    }


    @Override
    @Transactional
    public APIResponse<ProfileResponse> updateProfileInfo(ProfileRequestDTO profileRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (profileRequest.getEmail() != null && !profileRequest.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(profileRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }

        if (profileRequest.getPhoneNumber() != null && !profileRequest.getPhoneNumber().equals(user.getPhoneNumber())
                && userRepository.existsByPhoneNumber(profileRequest.getPhoneNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
        }

        if (profileRequest.getFullName() != null) user.setFullName(profileRequest.getFullName());
        if (profileRequest.getUsername() != null) user.setUsername(profileRequest.getUsername());
        if (profileRequest.getEmail() != null) user.setEmail(profileRequest.getEmail());
        if (profileRequest.getPhoneNumber() != null) user.setPhoneNumber(profileRequest.getPhoneNumber());
        if (profileRequest.getWebsite() != null) user.setWebsite(profileRequest.getWebsite());
        if (profileRequest.getBio() != null) user.setBio(profileRequest.getBio());
        if (profileRequest.getGender() != null) user.setGender(EGender.valueOf(profileRequest.getGender()));

        userRepository.save(user);

        ProfileResponse response = ProfileResponse.builder()
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .website(user.getWebsite())
                .bio(user.getBio())
                .gender(String.valueOf(user.getGender()))
                .avatarUrl(user.getAvatarUrl())
                .build();

        return APIResponse.<ProfileResponse>builder()
                .data(response)
                .message("Cập nhật thông tin cá nhân thành công")
                .status(HttpStatus.OK.value())
                .build();
    }

    @Override
    @Transactional
    public APIResponse<ProfileResponse> updateAvatar(MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ảnh đại diện không hợp lệ");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        try {
            String avatarUrl = cloudinaryService.uploadFile(avatar);
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Tải lên ảnh thất bại");
        }

        ProfileResponse response = ProfileResponse.builder()
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .website(user.getWebsite())
                .bio(user.getBio())
                .gender(String.valueOf(user.getGender()))
                .avatarUrl(user.getAvatarUrl())
                .build();

        return APIResponse.<ProfileResponse>builder()
                .data(response)
                .message("Cập nhật ảnh đại diện thành công")
                .status(HttpStatus.OK.value())
                .build();
    }

    @Override
    public APIResponse<Void> changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Mật khẩu không đúng");
        }

        String regex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$";
        if (!request.getPassword().matches(regex)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return APIResponse.<Void>builder()
                .message("Đổi mật khẩu thành công")
                .status(HttpStatus.OK.value())
                .build();
    }
}
