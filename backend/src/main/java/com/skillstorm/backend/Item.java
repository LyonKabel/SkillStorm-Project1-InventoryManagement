package com.skillstorm.backend;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String name;

    private long quantity;

    private String description;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Variant> variants = new ArrayList<>();


    // MANY items belong to ONE warehouse
    @ManyToOne
    @JoinColumn(name = "warehouse_id")
    @JsonBackReference
    private Warehouse warehouse;

    public Item() {
    }

    

    public List<Variant> getVariants() {
        return variants;
    }



    public void setVariants(List<Variant> variants) {
        this.variants = variants;
    }



    public Item(Long itemId, String name, long quantity, Warehouse warehouse, String description) {
        this.itemId = itemId;
        this.name = name;
        this.quantity = quantity;
        this.warehouse = warehouse;
        this.description = description;
    }



    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public long getQuantity() { return quantity; }
    public void setQuantity(long quantity) { this.quantity = quantity; }

    public Warehouse getWarehouse() { 
        return warehouse; 
    }
    public void setWarehouse(Warehouse warehouse) { 
        this.warehouse = warehouse; 
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    
}

