package com.back.repository;

import com.back.model.entity.Message;
import com.back.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface IMessageRepository extends JpaRepository<Message, Long>{
    List<Message> findBySender(User user);
}
