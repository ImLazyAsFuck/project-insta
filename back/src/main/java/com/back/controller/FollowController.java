package com.back.controller;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;
import com.back.service.follow.IFollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/follows")
@Tag(name = "Follow", description = "API theo dõi người dùng")
@SecurityRequirement(name = "Bearer Authentication")
public class FollowController {
    private final IFollowService followService;

    @PostMapping("/{followingId}")
    @Operation(summary = "Theo dõi người dùng", description = "Gửi yêu cầu theo dõi hoặc theo dõi trực tiếp nếu tài khoản không riêng tư")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công")
    })
    public ResponseEntity<APIResponse<Void>> followUser(@PathVariable Long followingId) {
        return ResponseEntity.ok(followService.followUser(followingId));
    }

    @PutMapping("/accept/{followId}")
    @Operation(summary = "Chấp nhận yêu cầu theo dõi", description = "Duyệt yêu cầu theo dõi của người khác")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chấp nhận yêu cầu thành công")
    })
    public ResponseEntity<APIResponse<Void>> acceptFollow(@PathVariable Long followId) {
        return ResponseEntity.ok(followService.acceptFollow(followId));
    }

    @DeleteMapping("/{followId}")
    @Operation(summary = "Hủy theo dõi hoặc xóa mối quan hệ theo dõi", description = "Ngừng theo dõi người khác hoặc gỡ người theo dõi")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Hủy theo dõi thành công")
    })
    public ResponseEntity<APIResponse<Void>> removeFollow(@PathVariable Long followId) {
        return ResponseEntity.ok(followService.removeFollow(followId));
    }

    @PutMapping("/decline/{followId}")
    @Operation(summary = "Từ chối yêu cầu theo dõi", description = "Từ chối yêu cầu theo dõi từ người khác")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Từ chối yêu cầu thành công")
    })
    public ResponseEntity<APIResponse<Void>> declineFollow(@PathVariable Long followId) {
        return ResponseEntity.ok(followService.declineFollow(followId));
    }

    @GetMapping("/requests")
    @Operation(summary = "Danh sách yêu cầu theo dõi", description = "Lấy danh sách người dùng đã gửi yêu cầu theo dõi mình")
    public ResponseEntity<APIResponse<List<ProfileResponse>>> getFollowRequests() {
        return ResponseEntity.ok(followService.getFollowRequests());
    }

    @GetMapping("/followers")
    @Operation(summary = "Danh sách người theo dõi", description = "Lấy danh sách người đang theo dõi mình")
    public ResponseEntity<APIResponse<List<ProfileResponse>>> getFollowers() {
        return ResponseEntity.ok(followService.getFollowers());
    }

    @GetMapping("/following")
    @Operation(summary = "Danh sách đang theo dõi", description = "Lấy danh sách người mà mình đang theo dõi")
    public ResponseEntity<APIResponse<List<ProfileResponse>>> getFollowing() {
        return ResponseEntity.ok(followService.getFollowing());
    }


}
