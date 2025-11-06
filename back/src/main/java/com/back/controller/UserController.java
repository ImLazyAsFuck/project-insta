package com.back.controller;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.ProfileResponse;
import com.back.model.entity.User;
import com.back.service.User.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "API người dùng")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController{

    private final IUserService userService;

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm người dùng theo tên", description = "Tìm kiếm bạn bè hoặc người dùng bằng tên")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Kết quả tìm kiếm",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ProfileResponse.class))))
    })
    public ResponseEntity<APIResponse<List<ProfileResponse>>> searchByUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.searchByUsername(username));
    }

}
