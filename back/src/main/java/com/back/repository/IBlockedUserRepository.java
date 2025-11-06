package com.back.repository;

import com.back.model.entity.BlockedUser;
import com.back.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IBlockedUserRepository extends JpaRepository<BlockedUser, Long>{
    boolean existsByUserAndBlockedUser(User user, User blockedUser);

    Optional<BlockedUser> findByUserAndBlockedUser(User blocker, User blocked);

    List<BlockedUser> findAllByUser(User blocker);
}