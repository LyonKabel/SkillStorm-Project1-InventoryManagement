package com.skillstorm.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillstorm.backend.Variant;

public interface VariantRepository extends JpaRepository<Variant, Long> {
    
}
