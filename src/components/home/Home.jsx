import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Clock, ArrowRight, Star } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import heroImage from '../../assets/hero_bread_cover.png';

function Home() {
  const navigate = useNavigate();

  const [stocks, setStocks] = React.useState([]);
  const [stockLoading, setStockLoading] = React.useState(true);
  const [stockError, setStockError] = React.useState(null);
  const [lastUpdated, setLastUpdated] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('realtime'); // 'realtime', 'undervalued', 'search'
  
  const [categories, setCategories] = React.useState([]);
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const fetchStockPrices = React.useCallback(async (tab) => {
    setStockLoading(true);
    try {
      const endpoint = tab === 'realtime' ? 'realtime' : 'undervalued';
      const response = await fetch(`http://localhost:8080/api/stock/${endpoint}`);
      if (!response.ok) {
        let errorMessage = '시세 정보를 가져오지 못했습니다.';
        try {
          const errBody = await response.json();
          if (errBody && errBody.message) {
            errorMessage = errBody.message;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setStocks(data);
      setLastUpdated(new Date().toLocaleTimeString('ko-KR'));
      setStockError(null);
    } catch (err) {
      console.warn('주식 API 호출 실패, 백엔드 서버 상태를 확인하세요.', err);
      setStockError(err.message);
      setStocks([]);
    } finally {
      setStockLoading(false);
    }
  }, []);

  const fetchCategories = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/stock/search/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.warn('카테고리 목록 조회 실패', err);
    }
  }, []);

  const handleSearch = React.useCallback(async (keyword) => {
    if (!keyword || keyword.trim() === '') return;
    setStockLoading(true);
    setStockError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/stock/search?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        let errorMessage = '검색 결과를 가져오지 못했습니다.';
        try {
          const errBody = await response.json();
          if (errBody && errBody.message) {
            errorMessage = errBody.message;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setStocks(data);
      setStockError(null);
    } catch (err) {
      console.warn('검색 API 호출 실패', err);
      setStockError(err.message);
      setStocks([]);
    } finally {
      setStockLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === 'search') {
      if (categories.length === 0) {
        fetchCategories();
      }
      return; // Do not poll on search tab
    }
    fetchStockPrices(activeTab);
    const interval = setInterval(() => {
      fetchStockPrices(activeTab);
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchStockPrices, activeTab, categories.length, fetchCategories]);

  // Mock Best Sellers for homepage display
  const bestSellers = [
    {
      id: 101,
      title: '시그니처 생(生) 밀크 식빵',
      subtitle: '물 한 방울 없이 100% 국산 1A 등급 원유와 생크림으로만 반죽하여 깃털처럼 부드럽고 쫄깃한 시그니처 식빵',
      price: '6,500원',
      badge: 'Best',
      tags: ['우유식빵', '시그니처', '뜯어먹는식빵'],
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop' // beautiful bread backup
    },
    {
      id: 102,
      title: '트리플 치즈 더블 롤 식빵',
      subtitle: '롤치즈, 체다치즈, 모짜렐라 세 가지 치즈가 반죽 속에 듬뿍 들어가 고소함과 짭조름함의 조화가 예술인 식빵',
      price: '7,500원',
      badge: 'Hot',
      tags: ['치즈식빵', '짭조름', '인기폭발'],
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 103,
      title: '유기농 통밀 무화과 식빵',
      subtitle: '국산 유기농 통밀 100% 반죽에 꿀에 절인 캘리포니아산 무화과와 고소한 호두가 듬뿍 박힌 건강 식빵',
      price: '8,000원',
      badge: 'New',
      tags: ['통밀식빵', '무화과', '비건친화'],
      image: 'https://images.unsplash.com/photo-1589415081126-768aadc43c06?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <div className="fade-in" style={{ width: '100%' }}>
      {/* 1. Hero Visual Section */}
      <section 
        style={{
          position: 'relative',
          height: '80vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to right, rgba(60, 42, 33, 0.8) 30%, rgba(60, 42, 33, 0.3) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div 
            style={{
              maxWidth: '650px',
              animation: 'fadeIn 1s ease-out forwards',
              backgroundColor: 'rgba(60, 42, 33, 0.45)',
              padding: '40px',
              borderRadius: 'var(--radius-lg)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span 
              className="font-serif" 
              style={{ 
                color: 'var(--primary-gold)', 
                fontSize: '18px', 
                fontWeight: '700', 
                letterSpacing: '3px',
                display: 'block',
                marginBottom: '16px',
                textTransform: 'uppercase'
              }}
            >
              Artisan Boulangerie
            </span>
            <h1 
              style={{ 
                fontSize: '48px', 
                fontWeight: '900', 
                lineHeight: '1.25', 
                marginBottom: '24px',
                wordBreak: 'keep-all'
              }}
            >
              시간이 구워내는<br />
              <span style={{ color: 'var(--primary-gold)' }}>느린 맛의 미학</span>, 밀아틀리에
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '32px', lineHeight: '1.7', wordBreak: 'keep-all' }}>
              밀아틀리에는 24시간 동안 정성껏 배양하는 천연 유산균 발효종과 최고급 유기농 원자료만을 사용하여 속이 편안하고 풍미가 깊은 명품 식빵을 만듭니다. 매일 아침 오븐에서 풍기는 고소한 행복을 만나보세요.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/products')}
                icon={<Sparkles size={18} />}
              >
                메뉴 둘러보기
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/notice')}
                style={{ color: '#ffffff', borderColor: '#ffffff', hoverBg: 'rgba(255,255,255,0.1)' }}
              >
                베이커리 소식
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Real-time Stock Ticker Widget */}
      <section style={{ backgroundColor: 'var(--bg-cream)', padding: '24px 0', borderBottom: '1px solid rgba(217, 160, 91, 0.15)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setActiveTab('realtime'); fetchStockPrices('realtime'); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid ' + (activeTab === 'realtime' ? 'var(--secondary-brown)' : 'rgba(60, 42, 33, 0.15)'),
                  backgroundColor: activeTab === 'realtime' ? 'var(--bg-coffee)' : '#ffffff',
                  color: activeTab === 'realtime' ? '#ffffff' : 'var(--bg-coffee)',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                🔥 실시간 거래량 상위 10
              </button>
              <button 
                onClick={() => { setActiveTab('undervalued'); fetchStockPrices('undervalued'); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid ' + (activeTab === 'undervalued' ? 'var(--secondary-brown)' : 'rgba(60, 42, 33, 0.15)'),
                  backgroundColor: activeTab === 'undervalued' ? 'var(--bg-coffee)' : '#ffffff',
                  color: activeTab === 'undervalued' ? '#ffffff' : 'var(--bg-coffee)',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                📊 가치분석 저평가 우량주 10
              </button>
              <button 
                onClick={() => { setActiveTab('search'); setStocks([]); setSearchKeyword(''); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid ' + (activeTab === 'search' ? 'var(--secondary-brown)' : 'rgba(60, 42, 33, 0.15)'),
                  backgroundColor: activeTab === 'search' ? 'var(--bg-coffee)' : '#ffffff',
                  color: activeTab === 'search' ? '#ffffff' : 'var(--bg-coffee)',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                🔍 테마/섹터 검색
              </button>
            </div>
            {lastUpdated && activeTab !== 'search' && (
              <span style={{ fontSize: '11px', color: 'var(--gray-500)' }}>마지막 갱신: {lastUpdated} (8초 주기)</span>
            )}
          </div>

          {activeTab === 'search' && (
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearch(searchKeyword); }}
                style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '600px' }}
              >
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="테마 또는 업종을 입력하세요 (예: 반도체, 이차전지, 바이오, 방산, ai 등)"
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(60, 42, 33, 0.2)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    color: 'var(--bg-coffee)'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-gold)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'var(--secondary-brown)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-gold)'}
                >
                  검색
                </button>
              </form>

              {categories.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--bg-coffee)', fontWeight: '800', marginRight: '4px' }}>추천 태그:</span>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSearchKeyword(cat); handleSearch(cat); }}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: '1px solid rgba(217, 160, 91, 0.25)',
                        backgroundColor: searchKeyword === cat ? 'var(--primary-gold-light)' : '#ffffff',
                        color: 'var(--bg-coffee)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseOver={(e) => {
                        if (searchKeyword !== cat) {
                          e.target.style.borderColor = 'var(--primary-gold)';
                          e.target.style.backgroundColor = 'rgba(217, 160, 91, 0.05)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (searchKeyword !== cat) {
                          e.target.style.borderColor = 'rgba(217, 160, 91, 0.25)';
                          e.target.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      #{cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {stockLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', color: 'var(--gray-500)', fontSize: '13px' }}>
              주식 시세 정보를 외부 API를 통해 직접 가져오는 중입니다...
            </div>
          ) : stockError ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '20px', 
              color: 'var(--accent-rust)', 
              backgroundColor: 'rgba(210, 93, 56, 0.05)',
              border: '1px dashed rgba(210, 93, 56, 0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px', 
              fontWeight: '600',
              gap: '6px',
              width: '100%'
            }}>
              <span>⚠️ 정보를 불러올 수 없습니다.</span>
              <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: 'normal' }}>상세 정보: {stockError}</span>
            </div>
          ) : activeTab === 'search' && stocks.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '40px 20px', 
              color: 'var(--bg-coffee)', 
              backgroundColor: 'rgba(60, 42, 33, 0.02)',
              border: '1px dashed rgba(60, 42, 33, 0.1)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px', 
              width: '100%',
              gap: '8px'
            }}>
              <span style={{ fontWeight: '800', fontSize: '15px' }}>🔍 원하는 테마나 섹터를 검색해 보세요.</span>
              <span style={{ color: 'var(--gray-500)', fontSize: '12px' }}>위의 추천 태그(#반도체, #이차전지 등)를 클릭하면 실시간 종목 시세를 바로 확인할 수 있습니다.</span>
            </div>
          ) : (
            <div className="stock-grid-container">
              {stocks.map(stock => {
                const isUp = stock.sign === '▲';
                const isDown = stock.sign === '▼';
                const arrowColor = isUp ? 'var(--accent-rust)' : isDown ? '#3182ce' : 'var(--gray-600)';
                const cardBg = isUp ? 'rgba(210, 93, 56, 0.03)' : isDown ? 'rgba(49, 130, 206, 0.03)' : '#ffffff';
                const cardBorder = isUp ? 'rgba(210, 93, 56, 0.15)' : isDown ? 'rgba(49, 130, 206, 0.15)' : 'rgba(60, 42, 33, 0.06)';

                return (
                  <div 
                    key={stock.ticker}
                    style={{
                      backgroundColor: cardBg,
                      border: `1px solid ${cardBorder}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform var(--transition-fast)',
                      cursor: 'default'
                    }}
                    className="stock-item-card"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--bg-coffee)' }}>{stock.companyName}</span>
                      <span style={{ fontSize: '10px', color: 'var(--gray-500)', fontWeight: '600' }}>{stock.ticker}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--bg-coffee)', fontFamily: 'monospace' }}>
                        {stock.currentPrice.toLocaleString()}원
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: arrowColor }}>
                        <span>{stock.sign} {stock.changePrice.toLocaleString()}</span>
                        <span style={{ fontSize: '12px' }}>({isDown ? '-' : ''}{stock.changeRate}%)</span>
                      </div>
                    </div>

                    {/* 가치 분석 지표가 있을 경우 함께 노출 */}
                    {stock.per !== null && stock.pbr !== null && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(60, 42, 33, 0.08)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--bg-coffee)', backgroundColor: 'var(--primary-gold-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          PER: {stock.per}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--bg-coffee)', backgroundColor: 'var(--primary-gold-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          PBR: {stock.pbr}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <style>{`
          .stock-grid-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          @media (min-width: 768px) {
            .stock-grid-container {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .stock-grid-container {
              grid-template-columns: repeat(5, 1fr);
            }
          }

          .stock-item-card {
            transition: transform var(--transition-fast), box-shadow var(--transition-fast);
          }

          .stock-item-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md) !important;
          }

          .pulse-indicator {
            width: 8px;
            height: 8px;
            background-color: #22c55e;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            animation: pulse 1.6s infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }
        `}</style>
      </section>

      {/* 2. Core Philosophy & Value Proposition */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="font-serif" style={{ fontSize: '14px', color: 'var(--primary-gold)', fontWeight: '700', letterSpacing: '2px' }}>OUR PHILOSOPHY</span>
            <h2 className="text-gradient">밀아틀리에의 세 가지 원칙</h2>
            <p>우리는 타협하지 않는 품질로 식빵의 기준을 세웁니다.</p>
            <div className="divider"></div>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              marginTop: '16px'
            }}
          >
            {/* Principle 1 */}
            <div style={{ textAlign: 'center', padding: '30px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-cream)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: 'var(--secondary-brown)' }}>
                <Clock size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--bg-coffee)' }}>24시간 천연 발효 저온 숙성</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                인위적인 이스트 사용을 최소화하고, 자체 배양한 천연 발효종을 사용하여 24시간 동안 느리게 숙성시킵니다. 빵을 먹은 후에도 속이 더부룩하지 않고 편안합니다.
              </p>
            </div>

            {/* Principle 2 */}
            <div style={{ textAlign: 'center', padding: '30px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-cream)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: 'var(--secondary-brown)' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--bg-coffee)' }}>유기농 밀가루 & 최고급 AOP 버터</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                캐나다산 프리미엄 유기농 밀가루와 프랑스 정부가 품질을 인증한 프랑스산 AOP 래스큐어 버터만을 아낌없이 사용하여 고소하고 리치한 최상의 풍미를 냅니다.
              </p>
            </div>

            {/* Principle 3 */}
            <div style={{ textAlign: 'center', padding: '30px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-cream)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: 'var(--secondary-brown)' }}>
                <Heart size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--bg-coffee)' }}>당일 생산, 당일 판매 원칙</h3>
              <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                방부제나 보존제를 일절 첨가하지 않으며, 매일 새벽에 구워낸 빵만을 한정 판매합니다. 신선하고 건강한 상태의 빵만을 고객의 식탁에 올릴 것을 약속합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Best Seller Highlight Carousel Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="font-serif" style={{ fontSize: '14px', color: 'var(--primary-gold)', fontWeight: '700', letterSpacing: '2px' }}>BEST SELLERS</span>
            <h2 className="text-gradient">아틀리에 베스트 메뉴</h2>
            <p>고객님들께 가장 사랑받는 대표 식빵 세 가지를 추천합니다.</p>
            <div className="divider"></div>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}
          >
            {bestSellers.map(product => (
              <Card 
                key={product.id}
                image={product.image}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                badge={product.badge}
                tags={product.tags}
                variant="product"
                onClick={() => navigate('/products')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Story Section (Dual Column Banner) */}
      <section 
        style={{ 
          backgroundColor: 'var(--bg-coffee)', 
          color: 'var(--bg-cream)',
          padding: '80px 0',
          position: 'relative'
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <span className="font-serif" style={{ color: 'var(--primary-gold)', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Baking Story</span>
            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '16px 0 24px 0', lineHeight: '1.3' }}>
              좋은 재료와 정성을 다해<br />
              매일 빵을 굽는 사람들
            </h2>
            <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: '1.8', marginBottom: '20px', wordBreak: 'keep-all' }}>
              저희는 식빵이 아침 식탁의 단순한 탄수화물이 아닌, 하루를 시작하는 온 가족의 소중한 한 끼 식사여야 한다고 믿습니다. 
              그래서 기계식 대량 생산 대신 베이커들의 손끝을 거치는 정통 수제 방식을 고수합니다.
            </p>
            <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: '1.8', marginBottom: '32px', wordBreak: 'keep-all' }}>
              가장 맛있는 밀가루 비율, 최적의 온습도, 발효 시간 1분 1초까지, 마스터 베이커들의 철저한 통제 아래 탄생한 수제 식빵의 남다른 쫄깃함과 리치한 풍미를 직접 경험해 보세요.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/products')}
              icon={<ArrowRight size={16} />}
            >
              전체 메뉴 알아보기
            </Button>
          </div>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img 
              src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop" 
              alt="Baking Bread" 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
