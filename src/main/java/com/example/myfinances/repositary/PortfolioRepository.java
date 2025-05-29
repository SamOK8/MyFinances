package com.example.myfinances.repositary;

import com.example.myfinances.model.Portfolio;
import com.example.myfinances.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findAllByUserEmail(String email);

}
