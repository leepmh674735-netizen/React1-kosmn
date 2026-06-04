package com.winter.app.stock;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class StockService {

    @Value("${app.stock.api-url:https://openapi.koreainvestment.com:5700}")
    private String apiUrl;

    @Value("${app.stock.api-key:none}")
    private String appKey;

    @Value("${app.stock.api-secret:none}")
    private String appSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private String accessToken = null;
    private long tokenExpiryTime = 0;

    // 시뮬레이션을 위한 기준 주가 데이터
    private static final Map<String, Integer> BASE_PRICES = new HashMap<>();
    private static final Map<String, String> COMPANY_NAMES = new HashMap<>();
    
    // 실시간 주가 등락 효과를 위한 저장소
    private final Map<String, Integer> currentPrices = new ConcurrentHashMap<>();

    static {
        BASE_PRICES.put("005930", 75300); // 삼성전자
        BASE_PRICES.put("000660", 188500); // SK하이닉스
        BASE_PRICES.put("005380", 252000); // 현대차
        BASE_PRICES.put("035420", 176500); // NAVER

        COMPANY_NAMES.put("005930", "삼성전자");
        COMPANY_NAMES.put("000660", "SK하이닉스");
        COMPANY_NAMES.put("005380", "현대차");
        COMPANY_NAMES.put("035420", "NAVER");
    }

    public List<StockDTO> getRealtimePrices() {
        List<StockDTO> list = new ArrayList<>();
        
        // API 키가 유효하지 않거나 "none" 일 경우 시뮬레이션 데이터 반환
        if ("none".equalsIgnoreCase(appKey) || appKey.trim().isEmpty() || "none".equalsIgnoreCase(appSecret)) {
            log.info("API 키가 설정되지 않아 실시간 주식 시세 시뮬레이션 모드를 가동합니다.");
            return getSimulatedPrices();
        }

        try {
            // Access Token 발급 및 갱신 점검
            checkAndRefreshToken();

            for (String ticker : BASE_PRICES.keySet()) {
                StockDTO stock = fetchStockPriceFromAPI(ticker);
                if (stock != null) {
                    list.add(stock);
                } else {
                    // API 응답 실패 시 해당 종목만 시뮬레이션으로 보완
                    list.add(getSimulatedPrice(ticker));
                }
            }
        } catch (Exception e) {
            log.error("외부 주식 API 호출 중 오류 발생, 시뮬레이션 모드로 전환합니다: {}", e.getMessage());
            return getSimulatedPrices();
        }

        return list;
    }

    /**
     * 한국투자증권 실시간 현재가 조회 API 호출
     */
    private StockDTO fetchStockPriceFromAPI(String ticker) {
        try {
            String url = apiUrl + "/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=" + ticker;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("authorization", "Bearer " + accessToken);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FBDT00100000"); // 주식현재가 시세 tr_id

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Map<String, String> output = (Map<String, String>) body.get("output");

                if (output != null) {
                    int price = Integer.parseInt(output.get("stck_prpr")); // 현재가
                    int change = Integer.parseInt(output.get("prdy_vrss")); // 전일대비 변동액
                    double rate = Double.parseDouble(output.get("prdy_ctrt")); // 전일대비 변동률
                    String signCode = output.get("prdy_vrss_sign"); // 대비 기호 코드

                    String sign = "-";
                    if ("1".equals(signCode) || "2".equals(signCode)) {
                        sign = "▲";
                    } else if ("4".equals(signCode) || "5".equals(signCode)) {
                        sign = "▼";
                    }

                    return new StockDTO(COMPANY_NAMES.get(ticker), ticker, price, change, rate, sign);
                }
            }
        } catch (Exception e) {
            log.warn("종목코드 {} API 조회 실패: {}", ticker, e.getMessage());
        }
        return null;
    }

    /**
     * Access Token 발급 및 유효 기간 체크
     */
    private synchronized void checkAndRefreshToken() {
        if (accessToken != null && System.currentTimeMillis() < tokenExpiryTime) {
            return; // 토큰 유효함
        }

        log.info("주식 API Access Token 발급/갱신을 요청합니다.");
        try {
            String url = apiUrl + "/oauth2/tokenP";
            Map<String, String> body = new HashMap<>();
            body.put("grant_type", "client_credentials");
            body.put("appkey", appKey);
            body.put("appsecret", appSecret);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> resBody = response.getBody();
                this.accessToken = (String) resBody.get("access_token");
                int expiresIn = (int) resBody.get("expires_in"); // 보통 86400초 (24시간)
                
                // 만료시간 안전마진 1시간 차감
                this.tokenExpiryTime = System.currentTimeMillis() + ((long) (expiresIn - 3600) * 1000);
                log.info("새로운 Access Token 발급 완료. 만료 예정 시간: {}", new Date(tokenExpiryTime));
            }
        } catch (Exception e) {
            log.error("Access Token 발급 중 예외 발생: {}", e.getMessage());
            throw new RuntimeException("API 인증 토큰 발급 실패", e);
        }
    }

    /**
     * 시뮬레이션 실시간 주가 리스트 생성
     */
    private List<StockDTO> getSimulatedPrices() {
        List<StockDTO> list = new ArrayList<>();
        for (String ticker : BASE_PRICES.keySet()) {
            list.add(getSimulatedPrice(ticker));
        }
        return list;
    }

    /**
     * 단일 종목 실시간 등락 시뮬레이션 계산
     */
    private StockDTO getSimulatedPrice(String ticker) {
        int base = BASE_PRICES.get(ticker);
        
        // 캐시 데이터가 없으면 기준 주가 삽입
        currentPrices.putIfAbsent(ticker, base);
        int current = currentPrices.get(ticker);

        // 호출할 때마다 -0.8% ~ +0.8% 범위 내에서 유기적으로 등락
        double changePercent = (Math.random() - 0.5) * 0.016;
        int delta = (int) (current * changePercent);
        
        // 단위 절사 (KRW 주식 호가단위 50원/100원/500원 등 간략 보정)
        if (Math.abs(delta) > 0) {
            delta = (delta / 100) * 100;
        }

        int nextPrice = current + delta;
        
        // 기준 주가 대비 너무 멀어지지 않도록 범위 고정 (최대 ±5% 이내 완화)
        if (nextPrice > base * 1.05) nextPrice = (int) (base * 1.05);
        if (nextPrice < base * 0.95) nextPrice = (int) (base * 0.95);

        currentPrices.put(ticker, nextPrice);

        int changePrice = nextPrice - base;
        double changeRate = ((double) changePrice / base) * 100.0;
        changeRate = Math.round(changeRate * 100.0) / 100.0; // 소수점 둘째자리 반올림

        String sign = "-";
        if (changePrice > 0) {
            sign = "▲";
        } else if (changePrice < 0) {
            sign = "▼";
            changePrice = Math.abs(changePrice);
        }

        return new StockDTO(COMPANY_NAMES.get(ticker), ticker, nextPrice, changePrice, changeRate, sign);
    }
}
