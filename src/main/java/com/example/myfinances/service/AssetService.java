package com.example.myfinances.service;

import com.example.myfinances.AssetType;
import com.example.myfinances.DTO.StockDataDTO;
import com.example.myfinances.service.cryptoApiResponseObjects.CryptoResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class AssetService {
    private final WebClient webClientStock = WebClient.create("https://finnhub.io");
    private final WebClient webClientCrypto = WebClient.create("https://pro-api.coinmarketcap.com");
    @Value("${finnhub.api.key}")
    private String FinnhubApiKey;
    @Value("${coinmarketcap.api.key}")
    private String coinMarketCapApiKey;
//    private final String finnhubQuoteUrl = "https://finnhub.io/api/v1/quote";

    public StockDataDTO getPrice(AssetType type, String symbol){
        if (type.equals(AssetType.CASH)){
            return new StockDataDTO(1.0, 0.0, 0.0, 0.0, 0.0, System.currentTimeMillis());
        }
        if (type == AssetType.STOCK) {
            StockDataDTO response = webClientStock.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/v1/quote") // "?symbol=" + symbol + "&token=" + apiKey
                            .queryParam("symbol", symbol)
                            .queryParam("token", FinnhubApiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(StockDataDTO.class)
                    .block();

            if (response != null) {
                if (response.getC() == 0.0 && response.getPc() == 0.0) {
                    throw new InvalidSymbolException("Invalid ticker symbol: " + symbol);
                }
                return response;
            } else {
                throw new RuntimeException("Empty response from API");
            }
        }
        if (type == AssetType.CRYPTO) {

            CryptoResponse response = webClientCrypto.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/cryptocurrency/quotes/latest")
                            .queryParam("symbol", symbol)
                            .build())
                    .header("X-CMC_PRO_API_KEY", coinMarketCapApiKey)
                    .header("Accept", "application/json")
                    .retrieve()
                    .bodyToMono(CryptoResponse.class)
                    .block();

            if (response != null &&
                    response.getData() != null &&
                    response.getData().containsKey(symbol)) {

                double price = response.getData()
                        .get(symbol)
                        .getQuote()
                        .get("USD")
                        .getPrice();

                return new StockDataDTO(
                        price, 0.0, 0.0, 0.0, 0.0,
                        System.currentTimeMillis()
                );
            } else {
                throw new InvalidSymbolException("Invalid crypto symbol: " + symbol);
            }
        }

        //return new StockDataDTO(0, 0, 0, 0, 0, System.currentTimeMillis());
        return null;
    }

}