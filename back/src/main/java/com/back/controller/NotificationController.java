package com.back.controller;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.NotificationResponse;
import com.back.service.notification.INotificationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class NotificationController{
    private final INotificationService notificationService;

    @GetMapping
    public ResponseEntity<APIResponse<List<NotificationResponse>>> getNotifications() {
        APIResponse<List<NotificationResponse>> response = notificationService.getNotifications();
        return ResponseEntity.ok(response);
    }
}
