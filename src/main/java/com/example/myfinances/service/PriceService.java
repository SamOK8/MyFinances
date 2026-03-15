package com.example.myfinances.service;

import com.example.myfinances.AssetType;
import com.example.myfinances.DTO.StockDataDTO;
import com.example.myfinances.model.Price;
import com.example.myfinances.repositary.AssetRepository;
import com.example.myfinances.repositary.AssetSymbolView;
import com.example.myfinances.repositary.PriceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PriceService {

    private final AssetRepository assetRepository;
    private final PriceRepository priceRepository;
    private final AssetService assetService;

    public void updatePrices() {
        List<AssetSymbolView> assetSymbols = assetRepository.findAllDistinctBy();

        for (AssetSymbolView asset : assetSymbols) {
            String symbol = asset.getSymbol();
            AssetType assetTypeEnum = AssetType.valueOf(asset.getType().toUpperCase());
//            String assetType = asset.getAssetType();  // maybe error

            try {
                if (assetTypeEnum == AssetType.CASH){
                    continue;
                }
                StockDataDTO stockData = assetService.getPrice(assetTypeEnum, symbol);

//                if ()  // price is same as last price, skip saving to database


                if (stockData != null) {
                    Price price = new Price();
                    price.setPrice(stockData.getC());
                    price.setSymbol(symbol);
                    price.setTimestamp(OffsetDateTime.now());

                    priceRepository.save(price);
                    log.info("Saved new price for {}: {}", symbol, stockData.getC());
                }
            } catch (Exception e) {
                log.info("Failed to fetch or save price for symbol, (probably invalid symbol): {}", symbol, e);
            }

        }
    }
}