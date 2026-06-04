package com.kosmo.stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockResponse {
    private String companyName;  // 기업명 (삼성전자 등)
    private String ticker;       // 종목코드 (005930 등)
    private int currentPrice;    // 현재가
    private int changePrice;     // 전일대비 변동금액
    private double changeRate;   // 전일대비 변동률 (%)
    private String sign;         // 대비 기호 ("▲", "▼", "-")
    
    // 기본적 분석 지표 (선택적 노출용)
    private Double per;          // 주가수익비율 (PER)
    private Double pbr;          // 주가순자산비율 (PBR)

    // 편의 생성자 (지표 없는 응답용)
    public StockResponse(String companyName, String ticker, int currentPrice, int changePrice, double changeRate, String sign) {
        this.companyName = companyName;
        this.ticker = ticker;
        this.currentPrice = currentPrice;
        this.changePrice = changePrice;
        this.changeRate = changeRate;
        this.sign = sign;
        this.per = null;
        this.pbr = null;
    }
}
