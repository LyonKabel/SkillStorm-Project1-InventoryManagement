package com.skillstorm.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillstorm.backend.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
