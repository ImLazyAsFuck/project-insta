package com.back.controller;

import com.back.model.dto.request.ChangePasswordRequest;
import com.back.model.dto.request.ProfileRequestDTO;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.service.account.IAccountSerivce;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/accounts")
@Tag(name = "Account", description = "API quản lý tài khoản")
public class AccountController{

    private final IAccountSerivce accountService;

    @GetMapping("/profile")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xem thông tin cá nhân", description = "Lấy thông tin hồ sơ người dùng hiện tại từ JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công",
                    content = @Content(schema = @Schema(implementation = ProfileResponse.class)))
    })
    public ResponseEntity<APIResponse<ProfileResponse>> getProfile() {
        return ResponseEntity.ok(accountService.getProfile());
    }

    @PutMapping("/profile")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cập nhật thông tin cá nhân", description = "Cập nhật hồ sơ người dùng hiện tại, có thể bao gồm avatar. Yêu cầu JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cập nhật thông tin thành công",
                    content = @Content(schema = @Schema(implementation = ProfileResponse.class)))
    })
    public ResponseEntity<APIResponse<ProfileResponse>> updateProfile(
           @Valid @ModelAttribute ProfileRequestDTO profileRequest
    ) {
        return ResponseEntity.ok(accountService.updateProfileInfo(profileRequest));
    }

    @PostMapping(value = "/profile/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Cập nhật ảnh đại diện",
            description = "Upload ảnh đại diện mới cho người dùng hiện tại. Yêu cầu gửi form-data với trường 'avatar' kiểu file."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cập nhật ảnh đại diện thành công",
                    content = @Content(schema = @Schema(implementation = ProfileResponse.class)))
    })
    public ResponseEntity<APIResponse<ProfileResponse>> updateAvatar(
            @RequestPart("avatar") MultipartFile avatar
    ) {
        return ResponseEntity.ok(accountService.updateAvatar(avatar));
    }

    @PutMapping("/change-password")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Đổi mật khẩu", description = "Đổi mật khẩu mới cho tài khoản đang đăng nhập. Yêu cầu JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đổi mật khẩu thành công")
    })
    public ResponseEntity<APIResponse<Void>> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        return ResponseEntity.ok(accountService.changePassword(request));
    }
}
