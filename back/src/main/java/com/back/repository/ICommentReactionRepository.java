package com.back.repository;

import com.back.model.entity.CommentReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICommentReactionRepository extends JpaRepository<CommentReaction, Long>{
    CommentReaction findByCommentIdAndUserId(Long commentId, Long userId);
}
