package com.example.myfinances.service.cryptoApiResponseObjects;

import java.util.Map;

public class CryptoData {

    private Map<String, Quote> quote;

    public Map<String, Quote> getQuote() {
        return quote;
    }

    public void setQuote(Map<String, Quote> quote) {
        this.quote = quote;
    }
}