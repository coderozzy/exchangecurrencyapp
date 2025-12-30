package com.exchangecurrencyapp.controller;

import com.exchangecurrencyapp.model.Transaction;
import com.exchangecurrencyapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired
    private TransactionRepository transactionRepository;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable String userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(transactions);
    }
}
