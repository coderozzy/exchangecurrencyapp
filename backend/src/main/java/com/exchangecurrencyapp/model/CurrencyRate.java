package com.exchangecurrencyapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrencyRate {
    private String currency;
    private String code;
    private BigDecimal mid;
    
    public CurrencyRate() {}
    
    public CurrencyRate(String currency, String code, BigDecimal mid) {
        this.currency = currency;
        this.code = code;
        this.mid = mid;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public BigDecimal getMid() {
        return mid;
    }
    
    public void setMid(BigDecimal mid) {
        this.mid = mid;
    }
}
