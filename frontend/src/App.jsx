import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ChevronRight, 
  RefreshCw, 
  Briefcase, 
  Bell, 
  User,
  MessageSquare,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const API_BASE_URL = 'http://localhost:8080/api';

// 국내 대표 4대 주식 단축코드 정의
const DEFAULT_CODES = ['005930', '000660', '005380', '035420'];

function App() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. 주식 시세 데이터 조회
  const fetchStockData = async () => {
    try {
      // 로컬 Spring Boot 백엔드 호출 시도
      const response = await axios.get(`${API_BASE_URL}/stocks/markets`);
      setStocks(response.data);
      
      // 선택된 주식이 있으면 업데이트
      if (selectedStock) {
        const updated = response.data.find(s => s.code === selectedStock.code);
        if (updated) setSelectedStock(updated);
      }
      
      setError(null);
    } catch (err) {
      console.warn("백엔드 API 호출 실패. Mock 데이터 모드로 작동합니다.", err.message);
      // 백엔드가 실행 중이 아니면 자체 프론트엔드 Mock 생성 (데모용)
      const mockStocks = [
        { code: '005930', name: '삼성전자', currentPrice: 72500, priceChange: 400, percentChange: 0.55, accumulatedVolume: 1245000, openPrice: 72100, highPrice: 73000, lowPrice: 72000 },
        { code: '000660', name: 'SK하이닉스', currentPrice: 118000, priceChange: -1200, percentChange: -1.01, accumulatedVolume: 856000, openPrice: 119200, highPrice: 119500, lowPrice: 117500 },
        { code: '005380', name: '현대차', currentPrice: 205000, priceChange: 3500, percentChange: 1.74, accumulatedVolume: 320000, openPrice: 201500, highPrice: 207000, lowPrice: 201000 },
        { code: '035420', name: 'NAVER', currentPrice: 185000, priceChange: 0, percentChange: 0.00, accumulatedVolume: 189000, openPrice: 185000, highPrice: 186500, lowPrice: 184000 }
      ].map(stock => {
        // 실시간 연동 느낌을 내기 위해 가격 랜덤 변동 유도
        const changePercent = (Math.random() * 1.6) - 0.8;
        const changePrice = Math.round(stock.currentPrice * (changePercent / 100));
        const updatedPrice = stock.currentPrice + changePrice;
        return {
          ...stock,
          currentPrice: updatedPrice,
          priceChange: changePrice,
          percentChange: Math.round(changePercent * 100) / 100
        };
      });

      setStocks(mockStocks);
      if (selectedStock) {
        const updated = mockStocks.find(s => s.code === selectedStock.code);
        if (updated) setSelectedStock(updated);
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. 초기 로드 및 3초 주기의 폴링 설정
  useEffect(() => {
    fetchStockData();
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchStockData();
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, selectedStock?.code]);

  // 3. 임의의 7일 주가 이력 생성 (차트용)
  useEffect(() => {
    if (selectedStock) {
      const basePrice = selectedStock.currentPrice;
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayString = `${date.getMonth() + 1}/${date.getDate()}`;
        
        // 과거 가격을 랜덤하게 연산
        const randomFactor = (Math.random() * 4) - 2; // -2% ~ +2%
        const price = Math.round(basePrice * (1 + (randomFactor * (i) / 100)));
        data.push({
          date: dayString,
          price: price
        });
      }
      // 오늘 날짜 가격은 현재가로 세팅
      data[data.length - 1].price = basePrice;
      setChartData(data);
    }
  }, [selectedStock?.code, selectedStock?.currentPrice]);

  // 첫 번째 항목 자동 선택
  useEffect(() => {
    if (stocks.length > 0 && !selectedStock) {
      setSelectedStock(stocks[0]);
    }
  }, [stocks]);

  // 주가 상승/하락 컬러 결정 함수
  const getPriceColor = (change) => {
    if (change > 0) return 'text-upRed';
    if (change < 0) return 'text-tossBlue';
    return 'text-tossGray-dark';
  };

  const getPriceBg = (change) => {
    if (change > 0) return 'bg-upRed-light';
    if (change < 0) return 'bg-tossBlue-light';
    return 'bg-tossGray-light';
  };

  // 포맷팅 함수
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  // 검색 필터링
  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.code.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-tossGray-light flex flex-col font-sans">
      
      {/* 1. 상단 네비게이션 바 */}
      <header className="sticky top-0 bg-white border-b border-tossGray-border z-50 shadow-sm transition-toss">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-tossBlue text-2xl font-bold tracking-tight select-none">toss</span>
            <span className="text-tossGray-title font-semibold text-lg">증권</span>
          </div>

          {/* 중앙 메뉴 (추후 자유게시판, 공지사항 매핑용) */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-tossBlue font-bold text-base transition-toss">주식시세</a>
            <a href="#" className="text-tossGray-text hover:text-tossGray-title font-medium text-base flex items-center gap-1.5 transition-toss">
              <MessageSquare size={18} />
              자유게시판
            </a>
            <a href="#" className="text-tossGray-text hover:text-tossGray-title font-medium text-base flex items-center gap-1.5 transition-toss">
              <FileText size={18} />
              공지사항
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-tossGray-dark" size={18} />
              <input
                type="text"
                placeholder="종목명 또는 코드 검색"
                className="pl-9 pr-4 py-2 bg-tossGray-light hover:bg-tossGray-border focus:bg-white border-none rounded-full text-sm outline-none w-48 md:w-60 transition-toss"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              className={`p-2 rounded-full hover:bg-tossGray-light text-tossGray-text transition-toss active-toss-click ${autoRefresh ? 'text-tossBlue' : ''}`}
              title="실시간 갱신 활성화"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={autoRefresh ? 'animate-spin' : ''} size={18} style={{ animationDuration: '4s' }} />
            </button>
            
            <button className="p-2 rounded-full hover:bg-tossGray-light text-tossGray-text transition-toss active-toss-click">
              <User size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. 메인 대시보드 콘텐츠 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 좌측: 실시간 주식 리스트 (Lg: 5/12 영역) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-toss border border-tossGray-border/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-tossGray-title flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tossBlue animate-pulse"></span>
                실시간 관심 주식
              </h2>
              {autoRefresh && (
                <span className="text-[11px] font-semibold text-tossBlue bg-tossBlue-light px-2 py-0.5 rounded-full">
                  실시간 연동중
                </span>
              )}
            </div>

            {/* 주식 리스트 */}
            <div className="flex flex-col">
              {loading ? (
                <div className="py-20 text-center text-tossGray-dark text-sm">주가 정보를 불러오는 중...</div>
              ) : filteredStocks.length === 0 ? (
                <div className="py-20 text-center text-tossGray-dark text-sm">검색 결과가 없습니다.</div>
              ) : (
                filteredStocks.map((stock) => {
                  const isSelected = selectedStock?.code === stock.code;
                  const isUp = stock.priceChange >= 0;
                  return (
                    <div
                      key={stock.code}
                      onClick={() => setSelectedStock(stock)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-toss mb-1.5 ${
                        isSelected 
                          ? 'bg-tossBlue-light/80 hover:bg-tossBlue-light' 
                          : 'hover:bg-tossGray-light'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-tossGray-title text-[15px]">{stock.name}</span>
                        <span className="text-xs text-tossGray-dark font-medium">{stock.code}</span>
                      </div>
                      
                      <div className="text-right flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-tossGray-title text-[15px]">
                            {formatNumber(stock.currentPrice)}원
                          </span>
                          <span className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${getPriceColor(stock.priceChange)}`}>
                            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {formatNumber(Math.abs(stock.priceChange))}원 ({isUp ? '+' : ''}{stock.percentChange}%)
                          </span>
                        </div>
                        <ChevronRight className="text-tossGray-border" size={16} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 소소한 지수 안내 보드 */}
          <div className="bg-white p-6 rounded-3xl shadow-toss border border-tossGray-border/40 grid grid-cols-2 gap-4">
            <div className="bg-tossGray-light/50 p-4 rounded-2xl">
              <span className="text-xs font-semibold text-tossGray-text">KOSPI</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-bold text-lg text-tossGray-title">2,654.50</span>
                <span className="text-xs font-bold text-upRed flex items-center">+0.45%</span>
              </div>
            </div>
            <div className="bg-tossGray-light/50 p-4 rounded-2xl">
              <span className="text-xs font-semibold text-tossGray-text">KOSDAQ</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-bold text-lg text-tossGray-title">882.10</span>
                <span className="text-xs font-bold text-tossBlue flex items-center">-0.12%</span>
              </div>
            </div>
          </div>
        </section>

        {/* 우측: 주식 상세 차트 및 지표 (Lg: 7/12 영역) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {selectedStock ? (
            <div className="bg-white p-6 md:p-8 rounded-4xl shadow-toss border border-tossGray-border/40 flex flex-col gap-6">
              
              {/* 주식 기본 정보 헤더 */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-tossGray-title">{selectedStock.name}</h1>
                    <span className="text-sm font-semibold text-tossGray-dark bg-tossGray-light px-2 py-0.5 rounded-md">
                      {selectedStock.code}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-extrabold tracking-tight text-tossGray-title">
                      {formatNumber(selectedStock.currentPrice)}원
                    </span>
                    <span className={`text-base font-bold flex items-center gap-0.5 ${getPriceColor(selectedStock.priceChange)}`}>
                      {selectedStock.priceChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {formatNumber(Math.abs(selectedStock.priceChange))}원 ({selectedStock.priceChange >= 0 ? '+' : ''}{selectedStock.percentChange}%)
                    </span>
                  </div>
                </div>
                
                <button className="flex items-center gap-1.5 px-4 py-2 bg-tossBlue-light text-tossBlue font-bold rounded-full text-sm hover:bg-tossBlue/10 transition-toss active-toss-click">
                  <Bell size={14} />
                  알림 설정
                </button>
              </div>

              {/* 7일 추이 간이 차트 */}
              <div className="h-64 w-full bg-tossGray-light/20 rounded-3xl p-2 border border-tossGray-border/20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedStock.priceChange >= 0 ? '#f04452' : '#3182f6'} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={selectedStock.priceChange >= 0 ? '#f04452' : '#3182f6'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: '#8b95a1', fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: '#8b95a1', fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#191f28', borderRadius: '12px', border: 'none', color: '#fff' }}
                      labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#8b95a1' }}
                      formatter={(value) => [`${formatNumber(value)}원`, '주가']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedStock.priceChange >= 0 ? '#f04452' : '#3182f6'} 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 세부 거래 지표 피드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="bg-tossGray-light/40 p-4 rounded-2xl flex flex-col">
                  <span className="text-xs font-semibold text-tossGray-dark">시가</span>
                  <span className="font-bold text-tossGray-title mt-1">{formatNumber(selectedStock.openPrice)}원</span>
                </div>
                <div className="bg-tossGray-light/40 p-4 rounded-2xl flex flex-col">
                  <span className="text-xs font-semibold text-tossGray-dark">고가</span>
                  <span className="font-bold text-upRed mt-1">{formatNumber(selectedStock.highPrice)}원</span>
                </div>
                <div className="bg-tossGray-light/40 p-4 rounded-2xl flex flex-col">
                  <span className="text-xs font-semibold text-tossGray-dark">저가</span>
                  <span className="font-bold text-tossBlue mt-1">{formatNumber(selectedStock.lowPrice)}원</span>
                </div>
                <div className="bg-tossGray-light/40 p-4 rounded-2xl flex flex-col">
                  <span className="text-xs font-semibold text-tossGray-dark">거래량</span>
                  <span className="font-bold text-tossGray-title mt-1">{formatNumber(selectedStock.accumulatedVolume)}주</span>
                </div>
              </div>

              {/* 주가 연동 정보 및 커뮤니티 연결 유도 슬롯 */}
              <div className="border-t border-tossGray-border/60 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-tossGray-light rounded-full text-tossBlue">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-tossGray-title">토론방에서 의견 나누기</h3>
                    <p className="text-xs text-tossGray-dark font-medium">현재 {selectedStock.name} 주주들의 활발한 소통이 이어지고 있습니다.</p>
                  </div>
                </div>
                <button className="px-4 py-2.5 bg-tossGray-light hover:bg-tossGray-border text-tossGray-title font-bold text-xs rounded-xl transition-toss active-toss-click">
                  참여하기
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white p-20 rounded-4xl shadow-toss border border-tossGray-border/40 text-center text-tossGray-dark">
              관심 종목을 선택하시면 상세 주가 정보와 차트가 제공됩니다.
            </div>
          )}
        </section>

      </main>

      {/* 3. 하단 푸터 */}
      <footer className="bg-white border-t border-tossGray-border mt-12 py-8 text-center text-xs text-tossGray-dark font-medium">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 주식회사 토스스탁. 모든 권리 보유.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">이용약관</a>
            <a href="#" className="hover:underline font-bold text-tossGray-text">개인정보처리방침</a>
            <a href="#" className="hover:underline">고객센터</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
