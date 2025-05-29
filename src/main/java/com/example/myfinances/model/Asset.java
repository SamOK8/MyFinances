package com.example.myfinances.model;

import com.example.myfinances.AssetType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private int quantity;
    private String symbol;

    @ManyToOne
    @JsonIgnore
    private Portfolio portfolio;
}
