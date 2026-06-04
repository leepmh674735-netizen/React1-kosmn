package com.winter.app.stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockDTO {
    private String companyName;  // 기업명 (삼성전자 등)
    private String ticker;       // 종목코드 (005930 등)
    private int currentPrice;    // 현재가
    private int changePrice;     // 전일대비 변동금액
    private double changeRate;   // 전일대비 변동률 (%)
    private String sign;         // 대비 기호 ("▲", "▼", "-")
}
