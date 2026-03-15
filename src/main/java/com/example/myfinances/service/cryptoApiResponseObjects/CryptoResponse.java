package com.example.myfinances.service.cryptoApiResponseObjects;

import java.util.Map;

public class CryptoResponse {

    private Map<String, CryptoData> data;

    public Map<String, CryptoData> getData() {
        return data;
    }

    public void setData(Map<String, CryptoData> data) {
        this.data = data;
    }
}