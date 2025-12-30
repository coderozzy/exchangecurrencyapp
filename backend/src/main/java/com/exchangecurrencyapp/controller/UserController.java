package com.exchangecurrencyapp.controller;

import com.exchangecurrencyapp.model.User;
import com.exchangecurrencyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/wallet")
    public ResponseEntity<Map<String, BigDecimal>> getUserWallet(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user.get().getWallet());
    }
}
