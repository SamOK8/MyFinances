package com.example.myfinances.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
@Entity
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private double quantity;
    private String symbol;
    
    private boolean archived = false;
    private OffsetDateTime timestamp;

    @ManyToOne
    @JsonIgnore
    private Portfolio portfolio;
}
