package com.kosmo.stock;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class StockService {

    private final KisService kisService;

    // 가치 분석(기본적 분석)을 진행할 대표 우량주 15대 종목 목록
    private static final Map<String, String> BLUE_CHIPS = new LinkedHashMap<>();

    // 전체 종목 코드와 한글명 매핑
    private static final Map<String, String> TICKER_NAMES = new HashMap<>();

    // 테마 및 섹터별 종목 매핑
    private static final Map<String, List<String>> CATEGORY_STOCKS = new LinkedHashMap<>();

    static {
        BLUE_CHIPS.put("005930", "삼성전자");
        BLUE_CHIPS.put("000660", "SK하이닉스");
        BLUE_CHIPS.put("005380", "현대차");
        BLUE_CHIPS.put("000270", "기아");
        BLUE_CHIPS.put("035420", "NAVER");
        BLUE_CHIPS.put("005490", "POSCO홀딩스");
        BLUE_CHIPS.put("051910", "LG화학");
        BLUE_CHIPS.put("055550", "신한지주");
        BLUE_CHIPS.put("105560", "KB금융");
        BLUE_CHIPS.put("066570", "LG전자");
        BLUE_CHIPS.put("012330", "현대모비스");
        BLUE_CHIPS.put("028260", "삼성물산");
        BLUE_CHIPS.put("086790", "하나금융지주");
        BLUE_CHIPS.put("316140", "우리금융지주");
        BLUE_CHIPS.put("068270", "셀트리온");

        // TICKER_NAMES 로드
        TICKER_NAMES.put("005930", "삼성전자");
        TICKER_NAMES.put("000660", "SK하이닉스");
        TICKER_NAMES.put("042700", "한미반도체");
        TICKER_NAMES.put("000990", "DB하이텍");
        TICKER_NAMES.put("005380", "현대차");
        TICKER_NAMES.put("000270", "기아");
        TICKER_NAMES.put("012330", "현대모비스");
        TICKER_NAMES.put("018880", "한온시스템");
        TICKER_NAMES.put("105560", "KB금융");
        TICKER_NAMES.put("055550", "신한지주");
        TICKER_NAMES.put("086790", "하나금융지주");
        TICKER_NAMES.put("316140", "우리금융지주");
        TICKER_NAMES.put("207940", "삼성바이오로직스");
        TICKER_NAMES.put("068270", "셀트리온");
        TICKER_NAMES.put("000100", "유한양행");
        TICKER_NAMES.put("128940", "한미약품");
        TICKER_NAMES.put("035420", "NAVER");
        TICKER_NAMES.put("035720", "카카오");
        TICKER_NAMES.put("377300", "카카오페이");
        TICKER_NAMES.put("323410", "카카오뱅크");
        TICKER_NAMES.put("373220", "LG에너지솔루션");
        TICKER_NAMES.put("006400", "삼성SDI");
        TICKER_NAMES.put("051910", "LG화학");
        TICKER_NAMES.put("003670", "포스코퓨처엠");
        TICKER_NAMES.put("086520", "에코프로");
        TICKER_NAMES.put("307870", "솔트룩스");
        TICKER_NAMES.put("377480", "마음AI");
        TICKER_NAMES.put("329180", "HD현대중공업");
        TICKER_NAMES.put("010140", "삼성중공업");
        TICKER_NAMES.put("042660", "한화오션");
        TICKER_NAMES.put("004020", "현대제철");
        TICKER_NAMES.put("012450", "한화에어로스페이스");
        TICKER_NAMES.put("079550", "LIG넥스원");
        TICKER_NAMES.put("064350", "현대로템");
        TICKER_NAMES.put("047810", "한국항공우주");
        TICKER_NAMES.put("352820", "하이브");
        TICKER_NAMES.put("035900", "JYP Ent.");
        TICKER_NAMES.put("041510", "에스엠");
        TICKER_NAMES.put("122870", "와이지엔터테인먼트");
        TICKER_NAMES.put("028260", "삼성물산");

        // 카테고리 구성
        CATEGORY_STOCKS.put("반도체", List.of("005930", "000660", "042700", "000990"));
        CATEGORY_STOCKS.put("이차전지", List.of("373220", "006400", "051910", "003670", "086520"));
        CATEGORY_STOCKS.put("자동차", List.of("005380", "000270", "012330", "018880"));
        CATEGORY_STOCKS.put("금융/은행", List.of("105560", "055550", "086790", "316140"));
        CATEGORY_STOCKS.put("바이오/제약", List.of("207940", "068270", "000100", "128940"));
        CATEGORY_STOCKS.put("IT/플랫폼", List.of("035420", "035720", "377300", "323410"));
        CATEGORY_STOCKS.put("인공지능/AI", List.of("035420", "035720", "307870", "377480"));
        CATEGORY_STOCKS.put("조선/중공업", List.of("329180", "010140", "042660", "004020"));
        CATEGORY_STOCKS.put("방산", List.of("012450", "079550", "064350", "047810"));
        CATEGORY_STOCKS.put("엔터테인먼트", List.of("352820", "035900", "041510", "122870"));
    }

    /**
     * 실시간 국내주식 거래량 상위 10개 종목 반환
     */
    public List<StockResponse> getRealtimePrices() {
        return kisService.fetchVolumeRank();
    }

    /**
     * 기본적 분석(PER & PBR)기반 순위 합산(Rank-Sum) 저평가 우량주 10개 추천
     */
    public List<StockResponse> getUndervaluedStocks() {
        List<StockResponse> fetched = new ArrayList<>();
        
        for (Map.Entry<String, String> entry : BLUE_CHIPS.entrySet()) {
            try {
                StockResponse stock = kisService.fetchStockPriceFromAPI(entry.getKey(), entry.getValue());
                if (stock != null && stock.getPer() != null && stock.getPbr() != null && 
                    stock.getPer() > 0.0 && stock.getPbr() > 0.0) {
                    fetched.add(stock);
                }
            } catch (Exception e) {
                log.warn("우량주 지표 수집 실패: {} ({}) - {}", entry.getValue(), entry.getKey(), e.getMessage());
            }
        }

        if (fetched.isEmpty()) {
            throw new RuntimeException("저평가 종목을 분석하기 위한 주식 시세 데이터 수집에 실패했습니다.");
        }

        List<StockResponse> sortedByPer = new ArrayList<>(fetched);
        sortedByPer.sort(Comparator.comparingDouble(StockResponse::getPer));
        Map<String, Integer> perRanks = new HashMap<>();
        for (int i = 0; i < sortedByPer.size(); i++) {
            perRanks.put(sortedByPer.get(i).getTicker(), i + 1);
        }

        List<StockResponse> sortedByPbr = new ArrayList<>(fetched);
        sortedByPbr.sort(Comparator.comparingDouble(StockResponse::getPbr));
        Map<String, Integer> pbrRanks = new HashMap<>();
        for (int i = 0; i < sortedByPbr.size(); i++) {
            pbrRanks.put(sortedByPbr.get(i).getTicker(), i + 1);
        }

        List<StockResponse> rankedList = new ArrayList<>(fetched);
        rankedList.sort((s1, s2) -> {
            int rankSum1 = perRanks.get(s1.getTicker()) + pbrRanks.get(s1.getTicker());
            int rankSum2 = perRanks.get(s2.getTicker()) + pbrRanks.get(s2.getTicker());
            return Integer.compare(rankSum1, rankSum2);
        });

        List<StockResponse> result = new ArrayList<>();
        int limit = Math.min(rankedList.size(), 10);
        for (int i = 0; i < limit; i++) {
            result.add(rankedList.get(i));
        }

        return result;
    }

    /**
     * 사용 가능한 모든 테마/섹터 카테고리 반환
     */
    public List<String> getCategories() {
        return new ArrayList<>(CATEGORY_STOCKS.keySet());
    }

    /**
     * 테마/섹터 키워드로 매칭 후 실시간 시세 리스트 반환
     */
    public List<StockResponse> searchBySectorOrTheme(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String targetKeyword = keyword.trim().toLowerCase();
        String matchedCategory = null;

        for (String category : CATEGORY_STOCKS.keySet()) {
            String normalizedCategory = category.toLowerCase();
            // 자모음이나 줄임표 포함한 매칭 지능형 분기
            if (normalizedCategory.contains(targetKeyword) || targetKeyword.contains(normalizedCategory) ||
                (category.equals("이차전지") && (targetKeyword.contains("배터리") || targetKeyword.contains("2차"))) ||
                (category.equals("금융/은행") && (targetKeyword.contains("은행") || targetKeyword.contains("증권"))) ||
                (category.equals("바이오/제약") && (targetKeyword.contains("제약") || targetKeyword.contains("헬스"))) ||
                (category.equals("인공지능/AI") && (targetKeyword.contains("ai") || targetKeyword.contains("지능"))) ||
                (category.equals("조선/중공업") && (targetKeyword.contains("철강") || targetKeyword.contains("조선") || targetKeyword.contains("중공업"))) ||
                (category.equals("엔터테인먼트") && (targetKeyword.contains("엔터") || targetKeyword.contains("음악") || targetKeyword.contains("하이브")))) {
                matchedCategory = category;
                break;
            }
        }

        if (matchedCategory == null) {
            throw new IllegalArgumentException("'" + keyword + "'에 해당하는 테마나 섹터를 찾을 수 없습니다.");
        }

        List<String> tickers = CATEGORY_STOCKS.get(matchedCategory);
        List<StockResponse> results = new ArrayList<>();

        for (String ticker : tickers) {
            try {
                String name = TICKER_NAMES.get(ticker);
                StockResponse stock = kisService.fetchStockPriceFromAPI(ticker, name);
                if (stock != null) {
                    results.add(stock);
                }
            } catch (Exception e) {
                log.warn("검색 종목 시세 수집 실패: {} - {}", ticker, e.getMessage());
            }
        }

        return results;
    }
}
