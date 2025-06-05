package com.example.myfinances.DTO;

import com.example.myfinances.model.Asset;
import com.example.myfinances.model.User;
import lombok.Data;

import java.util.Set;
@Data

public class PortfolioDTO {
    private Long id;

    private String name;
    private User user;
    private Set<AssetDTO> assets;
}
