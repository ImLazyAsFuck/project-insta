package com.back.service.auth;

import com.back.model.dto.request.LoginRequestDTO;
import com.back.model.dto.request.RegisterRequestDTO;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.JWTResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.RefreshToken;
import com.back.model.entity.Role;
import com.back.model.entity.User;
import com.back.model.enums.ERoleName;
import com.back.model.enums.EUserStatus;
import com.back.repository.IRoleRepository;
import com.back.repository.IUserRepository;
import com.back.security.jwt.JWTProvider;
import com.back.security.principal.CustomUserDetails;
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
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

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
                .token(accessToken)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
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
                .password(passwordEncoder.encode(dto.getPassword()))
                .status(EUserStatus.ACTIVE)
                .role(role)
                .phoneNumber(dto.getPhoneNumber())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        var refreshToken = refreshTokenService.createRefreshToken(user);

        JWTResponse jwtResponse = JWTResponse.builder()
                .token(accessToken)
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
                .token(newAccessToken)
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
    public APIResponse<Void> changePassword(String password, String confirmPassword) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (!password.equals(confirmPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không khớp");
        }

        String regex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";
        if (!password.matches(regex)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt");
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
                .gender(userDetails.getGender())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return APIResponse.<ProfileResponse>builder()
                .data(profileResponse)
                .message("Lấy thông tin cá nhân thành công")
                .status(HttpStatus.OK.value())
                .build();
    }

}