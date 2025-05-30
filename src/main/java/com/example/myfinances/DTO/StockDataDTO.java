package com.example.myfinances.DTO;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
//@RequiredArgsConstructor
public class StockDataDTO {
    private double c; // Current price
    private double h; // High price of the day
    private double l; // Low price of the day
    private double o; // Open price of the day
    private double pc; // Previous close price
    private Long t; // Timestamp of the data

    public StockDataDTO(double c, double h, double l, double o, double pc, long t) {
        this.c = c;
        this.h = h;
        this.l = l;
        this.o = o;
        this.pc = pc;
        this.t = t;
    }
}
