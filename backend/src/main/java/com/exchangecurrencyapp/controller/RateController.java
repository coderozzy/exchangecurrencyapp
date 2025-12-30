package com.exchangecurrencyapp.controller;

import com.exchangecurrencyapp.model.ExchangeRate;
import com.exchangecurrencyapp.service.NbpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rates")
@CrossOrigin(origins = "*")
public class RateController {
    @Autowired
    private NbpService nbpService;
    
    @GetMapping("/current")
    public ResponseEntity<List<ExchangeRate>> getCurrentRates() {
        List<ExchangeRate> rates = nbpService.fetchCurrentRates();
        return ResponseEntity.ok(rates);
    }
    
    @GetMapping("/history/{code}")
    public ResponseEntity<List<NbpService.RateHistoryItem>> getRateHistory(
            @PathVariable String code,
            @RequestParam(defaultValue = "30") int days) {
        List<NbpService.RateHistoryItem> history = nbpService.fetchRateHistory(code, days);
        return ResponseEntity.ok(history);
    }
}
