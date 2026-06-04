package com.kosmo.stockapp.domain.stock;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class StockService {

    @Value("${kis.api.url:https://openapivts.koreainvestment.com:29443}")
    private String apiUrl;

    @Value("${kis.api.app-key:}")
    private String appKey;

    @Value("${kis.api.app-secret:}")
    private String appSecret;

    private final RestClient restClient = RestClient.create();
    
    // 인메모리 토큰 캐시
    private String cachedToken = null;
    private LocalDateTime tokenExpireTime = null;

    // 주식 단축코드 매핑 딕셔너리
    private static final Map<String, String> STOCK_NAMES = Map.of(
        "005930", "삼성전자",
        "000660", "SK하이닉스",
        "005380", "현대차",
        "035420", "NAVER"
    );

    // Mock 시세 데이터 (API Key 연동 안 됐거나 휴일 등 대응용)
    private final Map<String, Long> mockPrices = new ConcurrentHashMap<>(Map.of(
        "005930", 72500L,
        "000660", 118000L,
        "005380", 205000L,
        "035420", 185000L
    ));

    /**
     * 한국투자증권 Access Token 발급/갱신 로직
     */
    public synchronized String getAccessToken() {
        if (appKey.isEmpty() || appSecret.isEmpty()) {
            log.warn("한국투자증권 API Key가 설정되지 않았습니다. Mock 데이터를 사용합니다.");
            return null;
        }

        // 캐시 만료 검증 (유효기간 24시간 중 여유시간 1시간을 둠)
        if (cachedToken != null && tokenExpireTime != null && tokenExpireTime.isAfter(LocalDateTime.now())) {
            return cachedToken;
        }

        try {
            log.info("한국투자증권 OAuth 토큰 발급 요청 중...");
            Map<String, String> requestBody = Map.of(
                "grant_type", "client_credentials",
                "appkey", appKey,
                "appsecret", appSecret
            );

            Map response = restClient.post()
                .uri(apiUrl + "/oauth2/tokenP")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

            if (response != null && response.containsKey("access_token")) {
                cachedToken = (String) response.get("access_token");
                int expiresIn = ((Number) response.get("expires_in")).intValue();
                tokenExpireTime = LocalDateTime.now().plusSeconds(expiresIn - 3600); // 1시간 조기 만료 처리
                log.info("한국투자증권 Access Token 갱신 완료. 유효시간: {}초", expiresIn);
                return cachedToken;
            }
        } catch (Exception e) {
            log.error("한국투자증권 Access Token 발급 중 오류 발생: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 특정 주식 종목의 시세 정보를 조회합니다.
     */
    public StockResponse getStockPrice(String code) {
        String name = STOCK_NAMES.getOrDefault(code, "알 수 없는 종목");
        String token = getAccessToken();

        // KIS API 연동이 어려운 경우 Mock 데이터 반환
        if (token == null) {
            return getMockStockResponse(code, name);
        }

        try {
            log.info("한국투자증권 API를 통해 현재가 조회 요청: {} ({})", name, code);

            Map response = restClient.get()
                .uri(apiUrl + "/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=" + code)
                .header("content-type", "application/json")
                .header("authorization", "Bearer " + token)
                .header("appkey", appKey)
                .header("appsecret", appSecret)
                .header("tr_id", "FHKST01010100") // 국내주식현재가 조회 ID
                .retrieve()
                .body(Map.class);

            if (response != null && response.containsKey("output")) {
                Map<String, Object> output = (Map<String, Object>) response.get("output");
                
                long currentPrice = Long.parseLong((String) output.get("stck_prpr"));
                long priceVrss = Long.parseLong((String) output.get("prdy_vrss")); // 전일 대비 가격차
                double percentChange = Double.parseDouble((String) output.get("prdy_ctrt")); // 전일 대비 비율
                long volume = Long.parseLong((String) output.get("acml_vol"));
                long openPrice = Long.parseLong((String) output.get("stck_oprc"));
                long highPrice = Long.parseLong((String) output.get("stck_hgpr"));
                long lowPrice = Long.parseLong((String) output.get("stck_lwpr"));

                // Mock 가격 캐시 최신화
                mockPrices.put(code, currentPrice);

                return new StockResponse(
                    code, name, currentPrice, priceVrss, percentChange, volume, openPrice, highPrice, lowPrice
                );
            }
        } catch (Exception e) {
            log.error("한국투자증권 API 호출 중 에러 발생 (Mock 데이터로 우회): {}", e.getMessage());
        }

        return getMockStockResponse(code, name);
    }

    /**
     * 테스트 및 대체용 Mock 데이터를 생성합니다.
     */
    private StockResponse getMockStockResponse(String code, String name) {
        long current = mockPrices.getOrDefault(code, 50000L);
        
        // 실시간 느낌을 주기 위해 소폭 변동 발생시킴 (-1% ~ +1% 범위)
        double changePercent = (Math.random() * 2.0) - 1.0;
        long changePrice = (long) (current * (changePercent / 100.0));
        long newPrice = current + changePrice;
        
        // Mock 가격 저장
        mockPrices.put(code, newPrice);

        long openPrice = (long) (newPrice * 0.995);
        long highPrice = (long) (newPrice * 1.015);
        long lowPrice = (long) (newPrice * 0.985);
        long volume = (long) (Math.random() * 1000000L) + 50000L;

        return new StockResponse(
            code, name, newPrice, changePrice, Math.round(changePercent * 100.0) / 100.0, volume, openPrice, highPrice, lowPrice
        );
    }
}
