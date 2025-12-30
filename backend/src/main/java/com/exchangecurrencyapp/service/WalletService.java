package com.exchangecurrencyapp.service;

import com.exchangecurrencyapp.model.Transaction;
import com.exchangecurrencyapp.model.TransactionType;
import com.exchangecurrencyapp.model.User;
import com.exchangecurrencyapp.repository.TransactionRepository;
import com.exchangecurrencyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.Optional;

@Service
public class WalletService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Transactional
    public User fundAccount(String userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        BigDecimal amountClean = amount.setScale(2, RoundingMode.HALF_UP);
        Map<String, BigDecimal> wallet = user.getWallet();
        BigDecimal currentPln = wallet.getOrDefault("PLN", BigDecimal.ZERO);
        wallet.put("PLN", currentPln.add(amountClean));
        user.setWallet(wallet);
        user = userRepository.save(user);
        
        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setType(TransactionType.DEPOSIT);
        tx.setCurrencyCode("PLN");
        tx.setAmountCurrency(amountClean);
        tx.setAmountPLN(amountClean);
        tx.setRate(BigDecimal.ONE);
        transactionRepository.save(tx);
        
        return user;
    }
    
    @Transactional
    public User exchangeCurrency(String userId, TransactionType type, String currencyCode, BigDecimal amountCurrency, BigDecimal rate) {
        if (amountCurrency == null || amountCurrency.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }
        
        if (rate == null || rate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid exchange rate");
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        Map<String, BigDecimal> wallet = user.getWallet();
        BigDecimal amountClean = amountCurrency.setScale(4, RoundingMode.HALF_UP);
        BigDecimal rateClean = rate.setScale(4, RoundingMode.HALF_UP);
        BigDecimal totalCostPLN = amountClean.multiply(rateClean).setScale(2, RoundingMode.HALF_UP);
        
        if (type == TransactionType.BUY) {
            BigDecimal currentPLN = wallet.getOrDefault("PLN", BigDecimal.ZERO);
            if (currentPLN.compareTo(totalCostPLN) < 0) {
                throw new RuntimeException("Insufficient PLN funds. Required: " + totalCostPLN + ", Available: " + currentPLN);
            }
            wallet.put("PLN", currentPLN.subtract(totalCostPLN));
            BigDecimal currentCurrency = wallet.getOrDefault(currencyCode, BigDecimal.ZERO);
            wallet.put(currencyCode, currentCurrency.add(amountClean));
        } else if (type == TransactionType.SELL) {
            BigDecimal currentHolding = wallet.getOrDefault(currencyCode, BigDecimal.ZERO);
            if (currentHolding.compareTo(amountClean) < 0) {
                throw new RuntimeException("Insufficient " + currencyCode + " funds. Required: " + amountClean + ", Available: " + currentHolding);
            }
            wallet.put(currencyCode, currentHolding.subtract(amountClean));
            BigDecimal currentPLN = wallet.getOrDefault("PLN", BigDecimal.ZERO);
            wallet.put("PLN", currentPLN.add(totalCostPLN));
        }
        
        user.setWallet(wallet);
        user = userRepository.save(user);
        
        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setType(type);
        tx.setCurrencyCode(currencyCode);
        tx.setAmountCurrency(amountClean);
        tx.setAmountPLN(totalCostPLN);
        tx.setRate(rateClean);
        transactionRepository.save(tx);
        
        return user;
    }
    
}
