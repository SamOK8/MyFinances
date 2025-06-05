package com.example.myfinances.controller;

import com.example.myfinances.AssetType;
import com.example.myfinances.DTO.AssetDTO;
import com.example.myfinances.DTO.PortfolioDTO;
import com.example.myfinances.DTO.StockDataDTO;
import com.example.myfinances.model.Asset;
import com.example.myfinances.model.Portfolio;
import com.example.myfinances.model.User;
import com.example.myfinances.repositary.UserRepository;
import com.example.myfinances.security.JwtUtil;
import com.example.myfinances.service.AssetService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
    private final com.example.myfinances.repositary.PortfolioRepository portfolioRepository;
    private final AssetService assetService;
    private final com.example.myfinances.repositary.UserRepository userRepository;




    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        portfolioRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/stock/quote/{type}/{symbol}")
    public StockDataDTO getPrice(@PathVariable AssetType type, @PathVariable String symbol) {

        return assetService.getPrice(type, symbol);
    }
    @PostMapping("/add")
    public ResponseEntity<PortfolioDTO> addPortfolio(@RequestBody PortfolioDTO portfolioDTO, Authentication authentication) {

        String userEmail = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with email: " + userEmail));

        Portfolio portfolio = new Portfolio();
        portfolio.setName(portfolioDTO.getName());
        portfolio.setUser(user);
        Set<Asset> assets = new HashSet<>();
        for (AssetDTO assetDTO : portfolioDTO.getAssets()) {
            Asset asset = new Asset();
            asset.setName(assetDTO.getName());
            asset.setType(assetDTO.getType());
            asset.setQuantity(assetDTO.getQuantity());
            asset.setSymbol(assetDTO.getSymbol());
            asset.setPortfolio(portfolio);
            assets.add(asset);
        }
        portfolio.setAssets(assets);

        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        PortfolioDTO responseDTO = new PortfolioDTO();
        responseDTO.setId(savedPortfolio.getId());
        responseDTO.setName(savedPortfolio.getName());
        responseDTO.setUser(savedPortfolio.getUser());
        responseDTO.setAssets(portfolioDTO.getAssets());

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }




    @GetMapping("/by-user")
    public ResponseEntity<List<PortfolioDTO>> getPortfoliosByUserWithPrices(Authentication authentication) {
        String userEmail = (String) authentication.getPrincipal();
        List<Portfolio> portfolioEntities = portfolioRepository.findAllByUserEmail(userEmail);

        List<PortfolioDTO> portfolioDTOs = new ArrayList<>();

        for (Portfolio portfolioEntity : portfolioEntities) {
            PortfolioDTO portfolioDTO = new PortfolioDTO();
            portfolioDTO.setId(portfolioEntity.getId());
            portfolioDTO.setName(portfolioEntity.getName());
            Set<AssetDTO> assetDTOs = new HashSet<>();
            if (portfolioEntity.getAssets() != null) {
                for (com.example.myfinances.model.Asset assetEntity : portfolioEntity.getAssets()) {
                    AssetDTO assetDTO = new AssetDTO();
                    assetDTO.setId(assetEntity.getId());
                    assetDTO.setName(assetEntity.getName());
                    assetDTO.setType(assetEntity.getType());
                    assetDTO.setQuantity(assetEntity.getQuantity());
                    assetDTO.setSymbol(assetEntity.getSymbol());

                    try {
                        AssetType assetTypeEnum = AssetType.valueOf(assetEntity.getType().toUpperCase());
                        StockDataDTO stockData = assetService.getPrice(assetTypeEnum, assetEntity.getSymbol());

                        if (stockData != null) {
                            assetDTO.setCurrentPrice(stockData.getC());
                        } else {
                            assetDTO.setCurrentPrice(0.0);
                        }
                    } catch (IllegalArgumentException e) {
                        System.err.println("Neplatný typ aktiva pro ID " + assetEntity.getId() + ": " + assetEntity.getType() + ". Cena nebyla načtena.");
                        assetDTO.setCurrentPrice(0.0);
                    } catch (Exception e) {
                        System.err.println("Chyba při načítání ceny pro symbol " + assetEntity.getSymbol() + ": " + e.getMessage());
                        assetDTO.setCurrentPrice(0.0);
                    }
                    assetDTOs.add(assetDTO);
                }
            }
            portfolioDTO.setAssets(assetDTOs);
            portfolioDTOs.add(portfolioDTO);
        }
        return ResponseEntity.ok(portfolioDTOs);
    }




}
