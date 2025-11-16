package com.skillstorm.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillstorm.backend.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long>{
    
}
