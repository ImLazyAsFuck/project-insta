package com.back.service.notification;

import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.NotificationResponse;

import java.util.List;

public interface INotificationService{
    APIResponse<List<NotificationResponse>> getNotifications();
//    APIResponse<Void> deleteNotification(Long notificationId);
}
