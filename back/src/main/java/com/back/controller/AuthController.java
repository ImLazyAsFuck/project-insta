package com.back.controller;

import com.back.model.dto.request.LoginRequestDTO;
import com.back.model.dto.request.ProfileRequestDTO;
import com.back.model.dto.request.RegisterRequestDTO;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.JWTResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.service.auth.IAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API quản lý xác thực và phân quyền")
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới", description = "Tạo tài khoản người dùng mới với email và mật khẩu")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Đăng ký thành công",
                    content = @Content(schema = @Schema(implementation = JWTResponse.class)))
    })
    public ResponseEntity<APIResponse<JWTResponse>> register(@Valid @RequestBody RegisterRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(dto));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập", description = "Đăng nhập với email và mật khẩu để nhận access token và refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công",
                    content = @Content(schema = @Schema(implementation = JWTResponse.class)))
    })
    public ResponseEntity<APIResponse<JWTResponse>> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Làm mới token", description = "Sử dụng refresh token để lấy access token mới")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Làm mới token thành công",
                    content = @Content(schema = @Schema(implementation = JWTResponse.class)))
    })
    public ResponseEntity<APIResponse<JWTResponse>> refresh(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Đăng xuất", description = "Đăng xuất và xóa refresh token khỏi hệ thống. Yêu cầu JWT token trong header")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Đăng xuất thành công")
    })
    public ResponseEntity<APIResponse<Void>> logout() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(authService.logout());
    }

    @PutMapping("/change-password")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Đổi mật khẩu", description = "Đổi mật khẩu mới cho tài khoản đang đăng nhập. Yêu cầu JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đổi mật khẩu thành công")
    })
    public ResponseEntity<APIResponse<Void>> changePassword(
            @RequestParam String oldPassword,
            @RequestParam String password,
            @RequestParam String confirmPassword
    ) {
        return ResponseEntity.ok(authService.changePassword(oldPassword, password, confirmPassword));
    }

    @GetMapping("/profile")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xem thông tin cá nhân", description = "Lấy thông tin hồ sơ người dùng hiện tại từ JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công",
                    content = @Content(schema = @Schema(implementation = ProfileResponse.class)))
    })
    public ResponseEntity<APIResponse<ProfileResponse>> getProfile() {
        return ResponseEntity.ok(authService.getProfile());
    }

    @PutMapping("/profile")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cập nhật thông tin cá nhân", description = "Cập nhật hồ sơ người dùng hiện tại, có thể bao gồm avatar. Yêu cầu JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cập nhật thông tin thành công",
                    content = @Content(schema = @Schema(implementation = ProfileResponse.class)))
    })
    public ResponseEntity<APIResponse<ProfileResponse>> updateProfile(
            @ModelAttribute ProfileRequestDTO profileRequest
    ) {
        return ResponseEntity.ok(authService.updateProfile(profileRequest));
    }

}

