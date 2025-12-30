package com.exchangecurrencyapp.service;

import com.exchangecurrencyapp.model.User;
import com.exchangecurrencyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    public User register(String username, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with this email already exists");
        }
        
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username cannot be empty");
        }
        
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        
        User user = new User(username, email, passwordEncoder.encode(password));
        return userRepository.save(user);
    }
    
    public User login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return user;
    }
}
