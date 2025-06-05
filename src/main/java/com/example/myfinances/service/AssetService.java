package com.example.myfinances.service;

import com.example.myfinances.AssetType;
import com.example.myfinances.DTO.StockDataDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AssetService {
    private final WebClient webClient;
    @Value("${finnhub.api.key}")
    private String apiKey;
    private final String finnhubQuoteUrl = "https://finnhub.io/api/v1/quote";

    public AssetService(WebClient webClient) {
        this.webClient = webClient;

    }

    public StockDataDTO getPrice(AssetType type, String symbol){
            if (type.equals(AssetType.CASH)){
                return new StockDataDTO(1.0, 0.0, 0.0, 0.0, 0.0, System.currentTimeMillis());
            }
        if (type.equals(AssetType.STOCK)){
            try {

                StockDataDTO response = webClient.get()
                        .uri(finnhubQuoteUrl + "?symbol=" + symbol + "&token=" + apiKey)
                        .retrieve()
                        .bodyToMono(StockDataDTO.class)
                        .block();
                if (response != null) {
                    return response;
                }else {
                    throw new RuntimeException();
                }


            }catch (Exception e){
                System.out.println("Error fetching stock data: " + e.getMessage());
            }




        }
        return new StockDataDTO(0, 0, 0, 0, 0, System.currentTimeMillis());
    }

}
