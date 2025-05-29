package com.example.myfinances.controller;

import com.example.myfinances.model.Portfolio;
import com.example.myfinances.model.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
    private final com.example.myfinances.repositary.PortfolioRepository portfolioRepository;



    @GetMapping("/by-user")
    public List<Portfolio> getPortfolioByUser(Authentication authentication) {
        //System.out.println(authentication.getName());

        String userEmail = "saminkoh@gmail.com";

        List<Portfolio> portfolios = portfolioRepository.findAllByUserEmail(userEmail);
        return new ArrayList<>(portfolios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        //portfolioService.deletePortfolio(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
