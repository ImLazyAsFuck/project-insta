package com.back.repository;

import com.back.model.entity.Follow;
import com.back.model.entity.User;
import com.back.model.enums.EFollowStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IFollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollowerAndFollowing(User follower, User following);

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    List<Follow> findByFollowingAndStatus(User following, EFollowStatus status);

    List<Follow> findByFollowerAndStatus(User follower, EFollowStatus status);

    void deleteByFollowerAndFollowing(User blocker, User blocked);

    long countByFollowingAndStatus(User following, EFollowStatus status);
    long countByFollowerAndStatus(User follower, EFollowStatus status);
}
