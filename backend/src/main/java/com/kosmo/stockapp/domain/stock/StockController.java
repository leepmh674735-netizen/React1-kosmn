package com.kosmo.stockapp.domain.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    // 실시간 시세 단일 조회
    @GetMapping("/{code}")
    public StockResponse getStockPrice(@PathVariable("code") String code) {
        return stockService.getStockPrice(code);
    }

    // 삼성전자, SK하이닉스, 현대차, NAVER 등 인기 종목 목록 일괄 조회
    @GetMapping("/markets")
    public List<StockResponse> getMarketStocks() {
        return List.of(
            stockService.getStockPrice("005930"), // 삼성전자
            stockService.getStockPrice("000660"), // SK하이닉스
            stockService.getStockPrice("005380"), // 현대차
            stockService.getStockPrice("035420")  // NAVER
        );
    }
}
