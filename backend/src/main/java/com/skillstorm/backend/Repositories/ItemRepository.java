package com.skillstorm.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillstorm.backend.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByWarehouse_WarehouseId(Long warehouseId);
}
