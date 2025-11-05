package com.back.service.auth;

import com.back.model.dto.request.LoginRequestDTO;
import com.back.model.dto.request.ProfileRequestDTO;
import com.back.model.dto.request.RegisterRequestDTO;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.JWTResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.RefreshToken;
import com.back.model.entity.Role;
import com.back.model.entity.User;
import com.back.model.enums.EGender;
import com.back.model.enums.ERoleName;
import com.back.model.enums.EUserStatus;
import com.back.repository.IRoleRepository;
import com.back.repository.IUserRepository;
import com.back.security.jwt.JWTProvider;
import com.back.security.principal.CustomUserDetails;
import com.back.service.cloudinary.CloudinaryService;
import com.back.service.refreshtoken.IRefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final IUserRepository userRepository;
    private final IRefreshTokenService refreshTokenService;
    private final JWTProvider jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final IRoleRepository roleRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public APIResponse<JWTResponse> login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getEmail(),
                        loginRequestDTO.getPassword()
                )
        );
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        JWTResponse jwtResponse = JWTResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .website(user.getWebsite())
                .bio(user.getBio())
                .status(user.getStatus())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return APIResponse.<JWTResponse>builder()
                .data(jwtResponse)
                .message("Login successfully")
                .status(HttpStatus.OK.value())
                .build();
    }

    @Override
    public APIResponse<JWTResponse> register(RegisterRequestDTO dto) {

        if(userRepository.existsByUsername(dto.getUsername())){
            throw new DataIntegrityViolationException("Tên người dùng đã tồn tại");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DataIntegrityViolationException("Email đã tồn tại");
        }

        if(userRepository.existsByPhoneNumber(dto.getPhoneNumber())){
            throw new DataIntegrityViolationException("Số điện thoại đã tồn tại");
        }

        Role role = roleRepository.findByName(ERoleName.ROLE_USER);

        User user = User.builder()
                .email(dto.getEmail())
                .username(dto.getUsername())
                .fullName(dto.getFullName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .status(EUserStatus.ACTIVE)
                .role(role)
                .gender(EGender.OTHER)
                .phoneNumber(dto.getPhoneNumber())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        var refreshToken = refreshTokenService.createRefreshToken(user);

        JWTResponse jwtResponse = JWTResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .build();

        return APIResponse.<JWTResponse>builder()
                .data(jwtResponse)
                .message("Đăng ký thành công")
                .status(HttpStatus.CREATED.value())
                .build();
    }

    @Override
    public APIResponse<Void> logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        refreshTokenService.deleteByUser(user);

        return APIResponse.<Void>builder()
                .message("Đăng xuất thành công")
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }

    @Override
    public APIResponse<JWTResponse> refreshToken(String refreshToken) {
        if (!refreshTokenService.validateToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED ,"refresh token bị lỗi hoặc hêt hạn");
        }

        User user = refreshTokenService.getUserByRefreshToken(refreshToken);
        String newAccessToken = jwtUtils.generateAccessToken(user.getEmail());

        JWTResponse jwtResponse = JWTResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .build();

        return APIResponse.<JWTResponse>builder()
                .data(jwtResponse)
                .message("Token được làm mới thành công")
                .status(HttpStatus.OK.value())
                .build();
    }

    @Override
    public APIResponse<Void> changePassword(String oldPassword, String password, String confirmPassword) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if(!passwordEncoder.matches(oldPassword, user.getPassword())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Mật khẩu không đúng");
        }

        String regex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$";
        if (!password.matches(regex)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt");
        }

        if (!password.equals(confirmPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không khớp");
        }

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        return APIResponse.<Void>builder()
                .message("Đổi mật khẩu thành công")
                .status(HttpStatus.OK.value())
                .build();
    }


    @Override
    public APIResponse<ProfileResponse> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        ProfileResponse profileResponse = ProfileResponse.builder()
                .fullName(user.getFullName())
                .username(user.getUsername())
                .website(user.getWebsite())
                .bio(user.getBio())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(String.valueOf(userDetails.getGender()))
                .avatarUrl(user.getAvatarUrl())
                .build();

        return APIResponse.<ProfileResponse>builder()
                .data(profileResponse)
                .message("Lấy thông tin cá nhân thành công")
                .status(HttpStatus.OK.value())
                .build();
    }

    @Override
    @Transactional
    public APIResponse<ProfileResponse> updateProfile(ProfileRequestDTO profileRequest) {
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

        MultipartFile avatar = profileRequest.getAvatar();
        if (avatar != null && !avatar.isEmpty()) {
            try {
                String avatarUrl = cloudinaryService.uploadFile(avatar);
                user.setAvatarUrl(avatarUrl);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload avatar thất bại");
            }
        }

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

}