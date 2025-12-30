package com.exchangecurrencyapp.controller;

import com.exchangecurrencyapp.model.User;
import com.exchangecurrencyapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (request.getUsername() == null || request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("All fields are required"));
            }
            User user = authService.register(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Email and password are required"));
            }
            User user = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage()));
        }
    }
    
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class LoginRequest {
        private String email;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
