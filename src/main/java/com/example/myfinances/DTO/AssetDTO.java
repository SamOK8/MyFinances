package com.example.myfinances.DTO;

import lombok.Data;

@Data
public class AssetDTO {
    private Long id;

    private String name;
    private String type;
    private double quantity;
    private String symbol;
    private double currentPrice;
}
