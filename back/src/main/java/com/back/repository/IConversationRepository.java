package com.back.repository;

import com.back.model.entity.Conversation;
import com.back.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IConversationRepository extends JpaRepository<Conversation, Long>{
    @Query("SELECT c FROM Conversation c JOIN c.participants p1 JOIN c.participants p2 " +
            "WHERE p1.id = :userId1 AND p2.id = :userId2 AND SIZE(c.participants) = 2")
    Optional<Conversation> findConversationByParticipants(@Param("userId1") Long userId1,
                                                          @Param("userId2") Long userId2);
}
