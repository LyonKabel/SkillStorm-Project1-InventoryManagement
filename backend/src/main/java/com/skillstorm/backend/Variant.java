package com.skillstorm.backend;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "variants")
public class Variant {
    @Id 
    @GeneratedValue
    private Long id;

    private String size;
    private String color;
    private Long quantityVariant;
    

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "item_id")
    private Item item;


    public Variant() {
    }


    public Long getId() {
        return id;
    }


    public Variant(Long id, String size, String color, Item item, Long quantityVariant) {
        this.id = id;
        this.size = size;
        this.color = color;
        this.item = item;
        this.quantityVariant = quantityVariant;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getSize() {
        return size;
    }


    public void setSize(String size) {
        this.size = size;
    }


    public String getColor() {
        return color;
    }


    public void setColor(String color) {
        this.color = color;
    }


    public Item getItem() {
        return item;
    }


    public void setItem(Item item) {
        this.item = item;
    }


    public Long getQuantityVariant() {
        return quantityVariant;
    }


    public void setQuantityVariant(Long quantityVariant) {
        this.quantityVariant = quantityVariant;
    }

    
}
