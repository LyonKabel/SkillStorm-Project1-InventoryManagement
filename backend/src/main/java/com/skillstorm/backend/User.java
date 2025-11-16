package com.skillstorm.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users") // Models a users table in my postgres
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Creates the id and make it auto generated
    private long userId;
    
    private String name; // Name of the user

    public long getId() {
        return userId;
    }

    public void setId(long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


}
