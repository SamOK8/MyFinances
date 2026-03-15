package com.example.myfinances.service;

public class InvalidSymbolException extends RuntimeException {
    public InvalidSymbolException(String message) {
        super(message);
    }
}
