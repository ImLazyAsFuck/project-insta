package com.back.repository;

import com.back.model.entity.Comment;
import com.back.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICommentRepository extends JpaRepository<Comment, Long>{
    List<Comment> findByPost(Post post);
}
