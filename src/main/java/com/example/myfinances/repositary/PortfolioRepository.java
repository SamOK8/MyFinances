package com.example.myfinances.repositary;

import com.example.myfinances.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findAllByUserEmail(String email);

}
