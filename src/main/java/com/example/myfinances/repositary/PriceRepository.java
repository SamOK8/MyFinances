package com.example.myfinances.repositary;

import com.example.myfinances.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PriceRepository extends JpaRepository<Price, Long> {
    Price findFirstBySymbolAndTypeOrderByTimestampDesc(String symbol, String type);
}
