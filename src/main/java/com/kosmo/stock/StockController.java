package com.kosmo.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    /**
     * 실시간 국내 주식 거래량 상위 10개 종목 조회 API
     */
    @GetMapping("/realtime")
    public List<StockResponse> getRealtimePrices() {
        try {
            return stockService.getRealtimePrices();
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * 기본적 가치 분석 기반 저평가 우량주 10개 조회 API
     */
    @GetMapping("/undervalued")
    public List<StockResponse> getUndervaluedStocks() {
        try {
            return stockService.getUndervaluedStocks();
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * 전체 테마 및 섹터 카테고리 목록 조회 API
     */
    @GetMapping("/search/categories")
    public List<String> getCategories() {
        return stockService.getCategories();
    }

    /**
     * 테마 및 섹터 키워드 검색 API
     */
    @GetMapping("/search")
    public List<StockResponse> searchBySectorOrTheme(@RequestParam("keyword") String keyword) {
        try {
            return stockService.searchBySectorOrTheme(keyword);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
