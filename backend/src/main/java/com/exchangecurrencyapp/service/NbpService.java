package com.exchangecurrencyapp.service;

import com.exchangecurrencyapp.model.CurrencyRate;
import com.exchangecurrencyapp.model.ExchangeRate;
import com.exchangecurrencyapp.model.NbpTableResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;

import java.math.BigDecimal;
import java.math.RoundingMode;
import javax.net.ssl.HttpsURLConnection;

@Service
public class NbpService {
    private static final Logger logger = LoggerFactory.getLogger(NbpService.class);
    private static final String NBP_API_URL = "https://api.nbp.pl/api/exchangerates/tables/A/?format=json";
    private static final BigDecimal SPREAD_PERCENTAGE = new BigDecimal("0.02");
    private final RestTemplate restTemplate;
    
    public NbpService() {
        try {
            javax.net.ssl.TrustManager[] trustAllCerts = new javax.net.ssl.TrustManager[]{
                new javax.net.ssl.X509TrustManager() {
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                }
            };

            javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());

            org.springframework.http.client.SimpleClientHttpRequestFactory requestFactory = 
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
            
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            
            javax.net.ssl.HostnameVerifier allHostsValid = (hostname, session) -> true;
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
            
            this.restTemplate = new RestTemplate();
        } catch (Exception e) {
            throw new RuntimeException("Failed to configure SSL bypass", e);
        }
    }
    
    public List<ExchangeRate> fetchCurrentRates() {
        try {
            logger.info("Fetching rates from NBP API: {}", NBP_API_URL);
            NbpTableResponse[] response = restTemplate.getForObject(NBP_API_URL, NbpTableResponse[].class);
            if (response != null && response.length > 0) {
                List<ExchangeRate> exchangeRates = new ArrayList<>();
                for (CurrencyRate rate : response[0].getRates()) {
                    BigDecimal mid = rate.getMid();
                    BigDecimal spread = mid.multiply(SPREAD_PERCENTAGE);
                    ExchangeRate exchangeRate = new ExchangeRate(
                        rate.getCurrency(),
                        rate.getCode(),
                        mid,
                        mid.subtract(spread).setScale(4, RoundingMode.HALF_UP),
                        mid.add(spread).setScale(4, RoundingMode.HALF_UP)
                    );
                    exchangeRates.add(exchangeRate);
                }
                logger.info("Successfully fetched {} exchange rates", exchangeRates.size());
                return exchangeRates;
            }
            logger.warn("NBP API returned empty response");
            return new ArrayList<>();
        } catch (RestClientException e) {
            logger.error("NBP API request failed: {}", e.getMessage(), e);
            return new ArrayList<>();
        } catch (Exception e) {
            logger.error("Unexpected error fetching NBP rates: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    public List<RateHistoryItem> fetchRateHistory(String code, int days) {
        try {
            String url = String.format("https://api.nbp.pl/api/exchangerates/rates/A/%s/last/%d/?format=json", code, days);
            logger.info("Fetching rate history from NBP API: {}", url);
            RateHistoryResponse response = restTemplate.getForObject(url, RateHistoryResponse.class);
            if (response != null && response.getRates() != null) {
                logger.info("Successfully fetched {} history items for {}", response.getRates().size(), code);
                return response.getRates();
            }
            logger.warn("NBP History API returned empty response for {}", code);
            return new ArrayList<>();
        } catch (RestClientException e) {
            logger.error("NBP History API request failed for {}: {}", code, e.getMessage(), e);
            return new ArrayList<>();
        } catch (Exception e) {
            logger.error("Unexpected error fetching NBP history for {}: {}", code, e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    

    
    public static class RateHistoryResponse {
        private String table;
        private String currency;
        private String code;
        private List<RateHistoryItem> rates;
        
        public String getTable() { return table; }
        public void setTable(String table) { this.table = table; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public List<RateHistoryItem> getRates() { return rates; }
        public void setRates(List<RateHistoryItem> rates) { this.rates = rates; }
    }
    
    public static class RateHistoryItem {
        private String effectiveDate;
        private BigDecimal mid;
        
        public String getEffectiveDate() { return effectiveDate; }
        public void setEffectiveDate(String effectiveDate) { this.effectiveDate = effectiveDate; }
        public BigDecimal getMid() { return mid; }
        public void setMid(BigDecimal mid) { this.mid = mid; }
    }
}
