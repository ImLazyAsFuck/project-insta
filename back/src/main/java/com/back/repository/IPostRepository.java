package com.back.repository;

import com.back.model.entity.Post;
import com.back.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface IPostRepository extends JpaRepository<Post, Long>{
    @Query("SELECT p FROM Post p WHERE p.user IN :followings ORDER BY p.createdAt DESC")
    List<Post> findByUserInOrderByCreatedAtDesc(List<User> followings);


    @Query("SELECT p FROM Post p WHERE p.user = :currentUser ORDER BY p.createdAt DESC")
    List<Post> findByUserByCreateAtDesc(User currentUser);

    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.media WHERE p IN :posts")
    List<Post> findAllWithMedia(@Param("posts") List<Post> posts);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.user = :user")
    long countPostsByUser(User user);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId")
    long countPostsByUserId(Long userId);

}
