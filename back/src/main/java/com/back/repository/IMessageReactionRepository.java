package com.back.repository;

import com.back.model.entity.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMessageReactionRepository extends JpaRepository<MessageReaction, Long>{
}
