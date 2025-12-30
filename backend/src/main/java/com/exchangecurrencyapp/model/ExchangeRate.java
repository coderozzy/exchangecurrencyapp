package com.exchangecurrencyapp.model;

import java.math.BigDecimal;

public class ExchangeRate extends CurrencyRate {
    private BigDecimal buy;
    private BigDecimal sell;
    
    public ExchangeRate() {
        super();
    }
    
    public ExchangeRate(String currency, String code, BigDecimal mid, BigDecimal buy, BigDecimal sell) {
        super(currency, code, mid);
        this.buy = buy;
        this.sell = sell;
    }
    
    public BigDecimal getBuy() {
        return buy;
    }
    
    public void setBuy(BigDecimal buy) {
        this.buy = buy;
    }
    
    public BigDecimal getSell() {
        return sell;
    }
    
    public void setSell(BigDecimal sell) {
        this.sell = sell;
    }
}
