package com.kosmo.stockapp.domain.stock;

public record StockResponse(
    String code,
    String name,
    long currentPrice,
    long priceChange,
    double percentChange,
    long accumulatedVolume,
    long openPrice,
    long highPrice,
    long lowPrice
) {}
