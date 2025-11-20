package com.skillstorm.backend;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "warehouses") // Models a users table in my postgres
public class Warehouse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Creates the id and make it auto generated
    private long warehouseId;
    
    private String name; // Name of the Warehouse

    private String location; // Location of warehouse

    private long maximumCapacity; // Max Capacity

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Item> items;

    public Warehouse() {
    }

    

    public Warehouse(long warehouseId, String name, String location, long maximumCapacity, List<Item> items) {
        this.warehouseId = warehouseId;
        this.name = name;
        this.location = location;
        this.maximumCapacity = maximumCapacity;
        this.items = items;
    }



    public long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public long getMaximumCapacity() {
        return maximumCapacity;
    }

    public void setMaximumCapacity(long maximumCapacity) {
        this.maximumCapacity = maximumCapacity;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }


}
