package com.exchangecurrencyapp.controller;

import com.exchangecurrencyapp.model.TransactionType;
import com.exchangecurrencyapp.model.User;
import com.exchangecurrencyapp.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import java.math.BigDecimal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {
    @Autowired
    private WalletService walletService;
    

    @PostMapping("/{userId}/fund")
    public ResponseEntity<?> fundAccount(@PathVariable String userId, @RequestBody FundRequest request) {
        try {
            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Amount must be greater than 0"));
            }
            User user = walletService.fundAccount(userId, request.getAmount());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/{userId}/exchange")
    public ResponseEntity<?> exchangeCurrency(
            @PathVariable String userId,
            @RequestBody ExchangeRequest request) {
        try {
            if (request.getType() == null || request.getCurrencyCode() == null || 
                request.getAmountCurrency() == null || request.getRate() == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("All fields are required"));
            }
            User user = walletService.exchangeCurrency(
                userId,
                TransactionType.valueOf(request.getType()),
                request.getCurrencyCode(),
                request.getAmountCurrency(),
                request.getRate()
            );
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid transaction type"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    public static class FundRequest {
        private BigDecimal amount;
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
    
    public static class ExchangeRequest {
        private String type;
        private String currencyCode;
        private BigDecimal amountCurrency;
        private BigDecimal rate;
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getCurrencyCode() { return currencyCode; }
        public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }
        public BigDecimal getAmountCurrency() { return amountCurrency; }
        public void setAmountCurrency(BigDecimal amountCurrency) { this.amountCurrency = amountCurrency; }
        public BigDecimal getRate() { return rate; }
        public void setRate(BigDecimal rate) { this.rate = rate; }
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
