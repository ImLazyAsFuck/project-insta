package com.back.repository;

import com.back.model.entity.Message;
import com.back.model.entity.MessageReaction;
import com.back.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IMessageReactionRepository extends JpaRepository<MessageReaction, Long>{
    Optional<MessageReaction> findByMessageAndUser(Message message, User user);
}
