package com.skillstorm.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.backend.Repositories.WarehouseRepository;
import com.skillstorm.backend.Warehouse;

@RestController
@RequestMapping("/warehouses") // The base of where the warehouses will be in the url
@CrossOrigin(origins = "http://localhost:3000")
public class WarehouseController {
    
    @Autowired
    private WarehouseRepository warehouseRepo;


    // Get all users
    @GetMapping
    public List<Warehouse> getWarehouses() {
        return warehouseRepo.findAll();
    }

    // Get a specific Warehouse
    @GetMapping("/{warehouseId}")
    public Warehouse getWarehouseById(@PathVariable Long warehouseId) {
        return warehouseRepo.findById(warehouseId)
            .orElseThrow(() -> new RuntimeException("User not found with id " + warehouseId)); // If the id isnt found throw this exception
    }

    // Create a Warehouse
    @PostMapping
    public Warehouse createWarehouse(@RequestBody Warehouse warehouse) {
        return warehouseRepo.save(warehouse);
    }

    // Update warehouse by id
    @PutMapping("/{warehouseId}")
    public Warehouse updateWarehouse(@PathVariable Long warehouseId, @RequestBody Warehouse updatedWarehouse) {
        return warehouseRepo.findById(warehouseId)
            .map(warehouse -> {
                warehouse.setName(updatedWarehouse.getName()); // update fields
                warehouse.setLocation(updatedWarehouse.getLocation());
                warehouse.setMaximumCapacity(updatedWarehouse.getMaximumCapacity());    
                // add more fields to update
                return warehouseRepo.save(warehouse); // save updated user
            })
            .orElseThrow(() -> new RuntimeException("Warehouse not found with id " + warehouseId));
    }
    

    // Delete warehouse by id
    @DeleteMapping("/{warehouseId}")
    public String deleteWarehouse(@PathVariable Long warehouseId) {
        if (!warehouseRepo.existsById(warehouseId)) {
            return "Warehouse not found with id " + warehouseId;
        }
        warehouseRepo.deleteById(warehouseId);
        System.out.println("Deleting warehouse with id: " + warehouseId);
        return "Warehouse deleted with id " + warehouseId; // doesnt throw an exception because deleting something that doesnt exist is whatever
    }


}
