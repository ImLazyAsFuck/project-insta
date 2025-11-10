package com.back.repository;

import com.back.model.entity.Post;
import com.back.model.entity.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPostMediaRepository extends JpaRepository<PostMedia, Long>{

    List<PostMedia> findByPost(Post post);
}
