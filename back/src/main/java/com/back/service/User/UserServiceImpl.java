package com.back.service.User;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;
import com.back.model.enums.EUserStatus;
import com.back.model.mapper.MapToProfileResponse;
import com.back.repository.IUserRepository;
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
                .map(MapToProfileResponse::mapToProfileResponse)
                .collect(Collectors.toList());

        return APIResponse.<List<ProfileResponse>>builder()
                .data(result)
                .message("Kết quả tìm kiếm")
                .status(200)
                .build();
    }

    @Override
    public APIResponse<ProfileResponse> getProfileByUsername(String username){
        User user = userRepository.findByUsername(username).orElse(null);

        if(user == null){
            throw new IllegalArgumentException("Không tìm thấy người dùng với username: " + username);
        }

        ProfileResponse profile = MapToProfileResponse.mapToProfileResponse(user);

        return APIResponse.<ProfileResponse>builder()
                .data(profile)
                .message("Lấy thông tin người dùng thành công")
                .build();
    }

}
