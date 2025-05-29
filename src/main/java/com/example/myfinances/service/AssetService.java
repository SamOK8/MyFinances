package com.example.myfinances.service;

import com.example.myfinances.AssetType;
import org.springframework.stereotype.Service;

@Service
public class AssetService {

    public double getPrice(AssetService type, String symbol){
            if (type.equals(AssetType.CASH)){
                return 1.0;
            }
        if (type.equals(AssetType.STOCK)){

        }
        return 0.0;
    }

}
