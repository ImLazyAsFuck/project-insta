package com.back.controller;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.repository.IBlockedUserRepository;
import com.back.service.block.IBlockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/block")
@Tag(name = "Block", description = "API chặn người dùng")
public class BlockUserController{

    private final IBlockService blockService;

    @PostMapping("/{userId}")
    @Operation(summary = "Chặn người dùng", description = "Chặn người dùng khác, ngăn họ theo dõi hoặc tương tác")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đã chặn người dùng")
    })
    public ResponseEntity<APIResponse<Void>> blockUser(@PathVariable Long userId) {
        return ResponseEntity.ok(blockService.blockUser(userId));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Bỏ chặn người dùng", description = "Bỏ chặn một người dùng đã bị chặn")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đã bỏ chặn người dùng")
    })
    public ResponseEntity<APIResponse<Void>> unblockUser(@PathVariable Long userId) {
        return ResponseEntity.ok(blockService.unblockUser(userId));
    }

    @GetMapping("/list")
    @Operation(summary = "Danh sách người dùng đã chặn")
    public ResponseEntity<APIResponse<List<ProfileResponse>>> getBlockedUsers() {
        return ResponseEntity.ok(blockService.getBlockedUsers());
    }

}
