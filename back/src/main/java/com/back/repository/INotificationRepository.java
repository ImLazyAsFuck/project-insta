package com.back.repository;

import com.back.model.entity.Notification;
import com.back.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, Long>{

    List<Notification> findByReceiverOrderByCreatedAtDesc(User user);
}
