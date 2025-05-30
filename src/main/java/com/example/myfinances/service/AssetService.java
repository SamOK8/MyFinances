package com.example.myfinances.service;

import com.example.myfinances.AssetType;
import com.example.myfinances.DTO.StockDataDTO;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AssetService {
    private final RestTemplate restTemplate;
    private final String apiKey = "d0s82c9r01qkkpltir50d0s82c9r01qkkpltir5g";
    private final String finnhubQuoteUrl = "https://finnhub.io/api/v1/quote?symbol={symbol}&token={token}";

    public AssetService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();

    }

    public StockDataDTO getPrice(AssetType type, String symbol){
            if (type.equals(AssetType.CASH)){
                return new StockDataDTO(1.0, 0.0, 0.0, 0.0, 0.0, System.currentTimeMillis());
            }
        if (type.equals(AssetType.STOCK)){

            try {
                return restTemplate.getForObject(
                        finnhubQuoteUrl,
                        StockDataDTO.class,
                        symbol,
                        apiKey
                );
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        return new StockDataDTO(0, 0, 0, 0, 0, System.currentTimeMillis());
    }

}
