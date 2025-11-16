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

import com.skillstorm.backend.Repositories.UserRepository;
import com.skillstorm.backend.User;

@RestController
@RequestMapping("/users") // The base of where the users will be in the url
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserRepository userRepo;


    // Get all users
    @GetMapping
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    // Get a specific user
    @GetMapping("/{userId}")
    public User getUserById(@PathVariable Long userId) {
        return userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id " + userId)); // If the id isnt found throw this exception
    }

    // Create a user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepo.save(user);
    }

    // Update user by id
    @PutMapping("/{userId}")
    public User updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        return userRepo.findById(userId)
            .map(user -> {
                user.setName(updatedUser.getName()); // update fields
                // add more fields to update
                return userRepo.save(user); // save updated user
            })
            .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
    }
    

    // Delete user by id
    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable Long userId) {
        if (!userRepo.existsById(userId)) {
            return "User not found with id " + userId;
        }
        userRepo.deleteById(userId);
        return "User deleted with id " + userId; // didnt throw an exception because deleting something that doesnt exist is whatever
    }


}
