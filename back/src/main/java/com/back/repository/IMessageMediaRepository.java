package com.back.repository;

import com.back.model.entity.MessageMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IMessageMediaRepository extends JpaRepository<MessageMedia, Long>{
}
