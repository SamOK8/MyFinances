package com.example.myfinances.service;

import com.example.myfinances.DTO.AssetDTO;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class ValueService {
    public int calculatePortfolioValue(Set<AssetDTO> assets){
        int value = 0;
        for (AssetDTO asset : assets){
            value += (int) (asset.getCurrentPrice() * asset.getQuantity());
        }

        return value;
    }

}
