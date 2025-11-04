package com.back.repository;

import com.back.model.entity.Role;
import com.back.model.enums.ERoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRoleRepository extends JpaRepository<Role, Long>{
    Role findByName(ERoleName name);
}
