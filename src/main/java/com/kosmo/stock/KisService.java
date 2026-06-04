package com.kosmo.stock;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class KisService {

    @Value("${app.stock.api-url:https://openapi.koreainvestment.com:5700}")
    private String apiUrl;

    @Value("${app.stock.api-key:none}")
    private String appKey;

    @Value("${app.stock.api-secret:none}")
    private String appSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private String accessToken = null;
    private long tokenExpiryTime = 0;

    /**
     * 한국투자증권 실시간 현재가 및 가치 평가 지표(PER/PBR) 조회
     */
    @SuppressWarnings("unchecked")
    public StockResponse fetchStockPriceFromAPI(String ticker, String companyName) {
        validateCredentials();

        try {
            checkAndRefreshToken();

            boolean isOtc = "302390".equals(ticker);
            String path = isOtc ? "/uapi/otc/v1/quotations/inquire-price" : "/uapi/domestic-stock/v1/quotations/inquire-price";
            String trId = isOtc ? "FBFM10100000" : "FBDT00100000";
            String divCode = isOtc ? "O" : "J";

            String url = apiUrl + path + "?FID_COND_MRKT_DIV_CODE=" + divCode + "&FID_INPUT_ISCD=" + ticker;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("authorization", "Bearer " + accessToken);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", trId);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Map<String, Object> output = (Map<String, Object>) body.get("output");

                if (output != null) {
                    int price = parseToInt(output.get("stck_prpr"), 0);
                    int change = parseToInt(output.get("prdy_vrss"), 0);
                    double rate = parseToDouble(output.get("prdy_ctrt"), 0.0);
                    String signCode = Objects.toString(output.get("prdy_vrss_sign"), "3");

                    String sign = "-";
                    if ("1".equals(signCode) || "2".equals(signCode)) {
                        sign = "▲";
                    } else if ("4".equals(signCode) || "5".equals(signCode)) {
                        sign = "▼";
                    }

                    // PER, PBR 파싱 추가
                    Double per = null;
                    Double pbr = null;
                    if (output.containsKey("per") && output.get("per") != null) {
                        double val = parseToDouble(output.get("per"), 0.0);
                        if (val != 0.0) per = val;
                    }
                    if (output.containsKey("pbr") && output.get("pbr") != null) {
                        double val = parseToDouble(output.get("pbr"), 0.0);
                        if (val != 0.0) pbr = val;
                    }

                    return new StockResponse(companyName, ticker, price, change, rate, sign, per, pbr);
                } else {
                    String rtCd = Objects.toString(body.get("rt_cd"), "");
                    String msg = Objects.toString(body.get("msg1"), "상세 메시지 없음");
                    throw new RuntimeException("API 응답 에러 (코드: " + rtCd + ", 메시지: " + msg + ")");
                }
            } else {
                throw new RuntimeException("HTTP 호출 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("종목코드 {} API 조회 실패: {}", ticker, e.getMessage());
            throw new RuntimeException("주식 정보를 가져오는 도중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 국내주식 실시간 거래량 순위 상위 10개 조회
     */
    @SuppressWarnings("unchecked")
    public List<StockResponse> fetchVolumeRank() {
        validateCredentials();

        List<StockResponse> list = new ArrayList<>();
        try {
            checkAndRefreshToken();

            String path = "/uapi/domestic-stock/v1/quotations/volume-rank";
            String url = apiUrl + path 
                    + "?FID_COND_MRKT_DIV_CODE=J"
                    + "&FID_COND_SCR_DIV_CODE=20171"
                    + "&FID_INPUT_ISCD=0000"
                    + "&FID_DIV_CLS_CODE=0"
                    + "&FID_BLNG_CLS_CODE=0"
                    + "&FID_TRGT_EXCL_CLS_CODE=0"
                    + "&FID_TRGT_CLS_CODE=0"
                    + "&FID_VOL_VAL_OPN_CODE=0";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("authorization", "Bearer " + accessToken);
            headers.set("appkey", appKey);
            headers.set("appsecret", appSecret);
            headers.set("tr_id", "FHPST01710000");
            headers.set("custtype", "P");

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> outputList = (List<Map<String, Object>>) body.get("output");

                if (outputList != null) {
                    // 상위 10개만 매핑
                    int limit = Math.min(outputList.size(), 10);
                    for (int i = 0; i < limit; i++) {
                        Map<String, Object> output = outputList.get(i);
                        String companyName = Objects.toString(output.get("hts_kor_isnm"), "알 수 없음");
                        String ticker = Objects.toString(output.get("mksc_shrn_iscd"), "");
                        int price = parseToInt(output.get("stck_prpr"), 0);
                        int change = parseToInt(output.get("prdy_vrss"), 0);
                        double rate = parseToDouble(output.get("prdy_ctrt"), 0.0);
                        String signCode = Objects.toString(output.get("prdy_vrss_sign"), "3");

                        String sign = "-";
                        if ("1".equals(signCode) || "2".equals(signCode)) {
                            sign = "▲";
                        } else if ("4".equals(signCode) || "5".equals(signCode)) {
                            sign = "▼";
                        }

                        list.add(new StockResponse(companyName, ticker, price, change, rate, sign));
                    }
                } else {
                    String rtCd = Objects.toString(body.get("rt_cd"), "");
                    String msg = Objects.toString(body.get("msg1"), "상세 메시지 없음");
                    throw new RuntimeException("거래량 순위 API 응답 에러 (코드: " + rtCd + ", 메시지: " + msg + ")");
                }
            } else {
                throw new RuntimeException("HTTP 호출 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("실시간 거래량 순위 조회 실패: {}", e.getMessage());
            throw new RuntimeException("실시간 거래량 순위를 가져오는 도중 오류가 발생했습니다: " + e.getMessage(), e);
        }
        return list;
    }

    private void validateCredentials() {
        if ("none".equalsIgnoreCase(appKey) || appKey.trim().isEmpty() || 
            "none".equalsIgnoreCase(appSecret) || appSecret.trim().isEmpty()) {
            log.error("[WARNING] 한국투자증권 API Key 또는 Secret이 설정되지 않았습니다.");
            throw new IllegalStateException("한국투자증권 API Key가 설정되지 않았습니다.");
        }
    }

    @SuppressWarnings("unchecked")
    private synchronized void checkAndRefreshToken() {
        if (accessToken != null && System.currentTimeMillis() < tokenExpiryTime) {
            return;
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
                int expiresIn = parseToInt(resBody.get("expires_in"), 86400);
                this.tokenExpiryTime = System.currentTimeMillis() + ((long) (expiresIn - 3600) * 1000);
                log.info("새로운 Access Token 발급 완료. 만료 예정 시간: {}", new Date(tokenExpiryTime));
            } else {
                throw new RuntimeException("토큰 발급 API 응답 실패");
            }
        } catch (Exception e) {
            log.error("Access Token 발급 중 예외 발생: {}", e.getMessage());
            throw new RuntimeException("API 인증 토큰 발급 실패: " + e.getMessage(), e);
        }
    }

    private int parseToInt(Object obj, int defaultValue) {
        if (obj == null) return defaultValue;
        if (obj instanceof Number) return ((Number) obj).intValue();
        try {
            return Integer.parseInt(obj.toString().trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private double parseToDouble(Object obj, double defaultValue) {
        if (obj == null) return defaultValue;
        if (obj instanceof Number) return ((Number) obj).doubleValue();
        try {
            return Double.parseDouble(obj.toString().trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
