package com.exchangecurrencyapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @ElementCollection
    @CollectionTable(name = "wallet", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "currency_code")
    @Column(name = "amount")
    private Map<String, BigDecimal> wallet = new HashMap<>();
    
    public User() {
        this.wallet.put("PLN", new BigDecimal("1000.00"));
    }
    
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.wallet = new HashMap<>();
        this.wallet.put("PLN", new BigDecimal("1000.00"));
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Map<String, BigDecimal> getWallet() {
        return wallet;
    }
    
    public void setWallet(Map<String, BigDecimal> wallet) {
        this.wallet = wallet;
    }
}
