package com.exchangecurrencyapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String userId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(nullable = false)
    private String currencyCode;
    
    @Column(nullable = false)
    private BigDecimal amountCurrency;
    
    @Column(nullable = false)
    private BigDecimal amountPLN;
    
    @Column(nullable = false)
    private BigDecimal rate;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
    }
    
    public Transaction() {}
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public TransactionType getType() {
        return type;
    }
    
    public void setType(TransactionType type) {
        this.type = type;
    }
    
    public String getCurrencyCode() {
        return currencyCode;
    }
    
    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }
    
    public BigDecimal getAmountCurrency() {
        return amountCurrency;
    }
    
    public void setAmountCurrency(BigDecimal amountCurrency) {
        this.amountCurrency = amountCurrency;
    }
    
    public BigDecimal getAmountPLN() {
        return amountPLN;
    }
    
    public void setAmountPLN(BigDecimal amountPLN) {
        this.amountPLN = amountPLN;
    }
    
    public BigDecimal getRate() {
        return rate;
    }
    
    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
