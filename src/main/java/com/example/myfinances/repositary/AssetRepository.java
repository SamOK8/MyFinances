package com.example.myfinances.repositary;

import com.example.myfinances.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<AssetSymbolView> findAllDistinctBy();
}
