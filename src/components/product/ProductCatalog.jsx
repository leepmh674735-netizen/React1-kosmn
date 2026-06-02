import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import SectionHeader from '../common/SectionHeader';
import { ShoppingCart, Heart, Info, Clock, AlertTriangle, Eye, X } from 'lucide-react';

const PRODUCTS_DATA = [
  // 1. Signature Milk Bread
  {
    id: 101,
    category: '시그니처',
    title: '시그니처 생(生) 밀크 식빵',
    englishTitle: 'Signature Fresh Milk Bread',
    price: '6,500원',
    rawPrice: 6500,
    subtitle: '물 없이 100% 국산 1A등급 생우유와 고농축 햅생크림으로만 채워 반죽하여 궁극의 쫄깃함과 우유 풍미를 완성한 식빵',
    description: '밀아틀리에의 자랑이자 얼굴인 시그니처 생 밀크 식빵입니다. 손으로 결을 따라 뜯어 드실 때 가장 깊은 우유향을 느끼실 수 있습니다. 오븐에서 갓 나온 부드러움을 그대로 구현하기 위해 매시간 정해진 시간에 구워냅니다.',
    ingredients: '국산 유기농 밀가루, 국산 1A등급 생우유 100%, 덴마크산 유기농 생크림, 프랑스 천일염',
    bakeTime: '매일 08:30 / 11:30 / 15:30',
    nutrition: '100g당 275kcal (탄수화물 45g, 단백질 8g, 지방 7g, 나트륨 340mg)',
    allergens: '우유, 밀 함유',
    badge: 'Best',
    tags: ['우유식빵', '시그니처', '뜯어먹는식빵'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 104,
    category: '시그니처',
    title: '24h 천연 발효 슬로우 식빵',
    englishTitle: '24h Sourdough Loaf',
    price: '6,000원',
    rawPrice: 6000,
    subtitle: '직접 배양한 사과 천연 유산균 발효종으로 24시간 동안 저온 숙성하여 구수한 누룽지향과 뛰어난 소화력을 선사하는 식빵',
    description: '이스트를 전혀 사용하지 않고 천연 효모만으로 정성스레 구워낸 식빵입니다. 자연스러운 산미와 씹을수록 깊어지는 곡물의 고소함이 특징이며, 속이 예민해 밀가루 소화가 어려우신 분들도 편안하게 드실 수 있습니다.',
    ingredients: '국산 유기농 밀가루, 사과 추출 천연발효종, 캐나다산 메이플 시럽, 정제수',
    bakeTime: '매일 09:30 / 14:30',
    nutrition: '100g당 245kcal (탄수화물 49g, 단백질 9g, 지방 1.5g, 나트륨 320mg)',
    allergens: '밀 함유 (비건 친화)',
    badge: 'New',
    tags: ['천연발효종', '소화편한빵', '비건식빵'],
    image: 'https://images.unsplash.com/photo-1589415081126-768aadc43c06?q=80&w=600&auto=format&fit=crop'
  },
  // 2. Savory Bread
  {
    id: 102,
    category: '세이버리',
    title: '트리플 치즈 더블 롤 식빵',
    englishTitle: 'Triple Cheese Roll Bread',
    price: '7,500원',
    rawPrice: 7500,
    subtitle: '롤치즈, 스위스 에멘탈 치즈, 모짜렐라 세 종류의 치즈를 터질 듯이 반죽 속에 채워 구워낸 고소하고 짭조름한 맥주 꿀페어링 식빵',
    description: '치즈 마니아를 위한 환상의 빵입니다. 살짝 렌지에 20초 데워 드시면 안쪽의 모짜렐라와 에멘탈 치즈가 마그마처럼 흘러내립니다. 와인이나 시원한 맥주 안주로도 훌륭합니다.',
    ingredients: '국산 유기농 밀가루, 미국산 롤치즈, 덴마크산 에멘탈 치즈, 모짜렐라 치즈, 무염버터',
    bakeTime: '매일 10:00 / 15:00',
    nutrition: '100g당 320kcal (탄수화물 41g, 단백질 12g, 지방 12g, 나트륨 480mg)',
    allergens: '밀, 우유 함유',
    badge: 'Hot',
    tags: ['치즈식빵', '짭조름', '전자레인지20초'],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 105,
    category: '세이버리',
    title: '지리산 공주 알밤 식빵',
    englishTitle: 'Gongju Chestnut Shokupan',
    price: '7,000원',
    rawPrice: 7000,
    subtitle: '지리산 기슭에서 채취한 당도 높은 공주 왕알밤을 듬뿍 넣고 위에는 바삭한 소보로 토핑을 얹은 달콤 고소한 국민 영양 간식 식빵',
    description: '통조림 밤이 아닌, 지리산 알밤만을 엄선하여 직접 당절임해 넣었습니다. 빵 반 조각만 뜯어도 왕밤이 알차게 우수수 떨어지는 압도적인 부재료 양을 자랑합니다.',
    ingredients: '국산 유기농 밀가루, 지리산 공주밤 40%, 우유버터, 아몬드분말, 시나몬 파우더',
    bakeTime: '매일 09:00 / 13:00',
    nutrition: '100g당 298kcal (탄수화물 52g, 단백질 7g, 지방 6g, 나트륨 290mg)',
    allergens: '밀, 우유, 계란, 밤 함유',
    badge: '',
    tags: ['밤식빵', '소보로', '부모님선물추천'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  },
  // 3. Sweet / Pastry
  {
    id: 106,
    category: '스위트',
    title: '벨기에 다크 초코 마블 식빵',
    englishTitle: 'Belgian Dark Chocolate Shokupan',
    price: '7,200원',
    rawPrice: 7200,
    subtitle: '카카오 58% 리얼 벨기에산 초콜릿 가나슈를 예술적인 링 형태로 마블링하여 구워낸 기분 좋은 단맛의 식빵',
    description: '지친 오후 시간에 어울리는 달콤한 식빵입니다. 고급스러운 다크 초콜릿 카카오의 쌉싸름한 맛과 빵결의 단맛이 과하지 않게 어우러져 아메리카노와 궁극의 페어링을 자랑합니다.',
    ingredients: '국산 유기농 밀가루, 벨기에산 다크초콜릿(카카오 58%), 우유, 벨기에산 코코아 파우더',
    bakeTime: '매일 10:30 / 16:00',
    nutrition: '100g당 345kcal (탄수화물 55g, 단백질 6.5g, 지방 11g, 나트륨 250mg)',
    allergens: '밀, 우유, 대두 함유',
    badge: 'Best',
    tags: ['초코식빵', '달콤함', '초코마블'],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 107,
    category: '스위트',
    title: '시나몬 피칸 카라멜 식빵',
    englishTitle: 'Cinnamon Pecan Shokupan',
    price: '7,500원',
    rawPrice: 7500,
    subtitle: '시나몬 슈가 분말과 바삭하고 고소한 캘리포니아산 피칸, 그리고 직접 졸인 카라멜 시럽이 회오리 모양으로 스며든 스위트 식빵',
    description: '오븐에서 구워질 때부터 온 매장에 호두파이 향기가 퍼지는 기분 좋은 시나몬 식빵입니다. 카라멜의 리치함과 피칸의 오독오독 씹히는 식감이 일품입니다.',
    ingredients: '국산 유기농 밀가루, 캘리포니아산 피칸, 베트남산 시나몬파우더, 직접 졸인 수제카라멜시럽',
    bakeTime: '매일 11:00',
    nutrition: '100g당 315kcal (탄수화물 48g, 단백질 7g, 지방 10g, 나트륨 270mg)',
    allergens: '밀, 우유, 견과류(피칸) 함유',
    badge: '',
    tags: ['시나몬식빵', '피칸견과류', '아메리카노짝꿍'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  },
  // 4. Whole Wheat / Healthy
  {
    id: 103,
    category: '헬시/통밀',
    title: '유기농 통밀 무화과 식빵',
    englishTitle: 'Organic Whole Wheat Fig Loaf',
    price: '8,000원',
    rawPrice: 8000,
    subtitle: '국산 유기농 통밀 100% 반죽에 꿀에 졸여 부드러운 무화과와 고소한 로스팅 호두를 가득 품은 내추럴 헬시 식빵',
    description: '거칠지만 구수한 통밀 본연의 매력을 가득 담은 비건 친화 건강 식빵입니다. 무화과의 톡톡 터지는 씨앗 식감과 쫀득한 달콤함이 심심한 통밀 맛에 생기를 불어넣어 줍니다. 샌드위치용으로 강추합니다.',
    ingredients: '국산 유기농 통밀가루 100%, 캘리포니아산 무화과, 로스팅 호두분태, 정제수',
    bakeTime: '매일 08:30 / 14:00',
    nutrition: '100g당 235kcal (탄수화물 47g, 단백질 10g, 지방 3.5g, 나트륨 310mg)',
    allergens: '밀, 호두 함유 (비건 친화)',
    badge: 'New',
    tags: ['통밀식빵', '무화과호두', '다이어트추천'],
    image: 'https://images.unsplash.com/photo-1589415081126-768aadc43c06?q=80&w=600&auto=format&fit=crop'
  }
];

function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }
  };

  const categories = ['전체', '시그니처', '세이버리', '스위트', '헬시/통밀'];

  const filteredProducts = activeCategory === '전체' 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === activeCategory);

  // Modal Backdrop CSS
  const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(60, 42, 33, 0.7)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backdropFilter: 'blur(4px)'
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <SectionHeader 
        upperTitle="ATELIER MENU"
        title="밀아틀리에 식빵소개"
        description="엄선된 유기농 원료와 24시간의 기다림으로 완성되는 아틀리에 수제 식빵 라인업입니다."
      />

      {/* Categories Switch Tabs */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '48px' 
        }}
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              border: activeCategory === cat ? '1px solid var(--primary-gold)' : '1px solid var(--gray-300)',
              backgroundColor: activeCategory === cat ? 'var(--primary-gold)' : '#ffffff',
              color: activeCategory === cat ? 'var(--bg-coffee)' : 'var(--gray-700)',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeCategory === cat ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
              transition: 'var(--transition-fast)'
            }}
            className="cat-tab-btn"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Menu Catalog */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px' 
        }}
      >
        {filteredProducts.map(product => (
          <div key={product.id} style={{ position: 'relative' }}>
            <Card
              image={product.image}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              badge={product.badge}
              tags={product.tags}
              variant="product"
              onClick={() => setSelectedProduct(product)}
            />
            {/* Wishlist toggle button on top right of image */}
            <button
              onClick={(e) => toggleWishlist(product.id, e)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: wishlist.includes(product.id) ? 'var(--accent-rust)' : 'var(--gray-400)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'var(--transition-fast)'
              }}
              className="wish-btn"
            >
              <Heart size={18} fill={wishlist.includes(product.id) ? 'var(--accent-rust)' : 'none'} />
            </button>
          </div>
        ))}
      </div>

      {/* 5. Interactive Detail Information Modal */}
      {selectedProduct && (
        <div 
          style={modalBackdropStyle} 
          onClick={() => setSelectedProduct(null)} 
          className="fade-in"
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(60, 42, 33, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent close on modal body click
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(60, 42, 33, 0.05)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                color: 'var(--bg-coffee)'
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Body Container */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {/* Product Left Visual */}
              <div style={{ position: 'relative', height: '100%', minHeight: '350px' }}>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {selectedProduct.badge && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      backgroundColor: 'var(--accent-rust)',
                      color: '#ffffff',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {selectedProduct.badge}
                  </span>
                )}
              </div>

              {/* Product Right Specifications */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-gold)', letterSpacing: '1px' }}>
                    {selectedProduct.category} COLLECTION
                  </span>
                  <h3 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--bg-coffee)', marginTop: '4px', marginBottom: '2px' }}>
                    {selectedProduct.title}
                  </h3>
                  <span className="font-serif" style={{ fontSize: '14px', color: 'var(--gray-500)', fontStyle: 'italic', display: 'block', marginBottom: '8px' }}>
                    {selectedProduct.englishTitle}
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--secondary-brown)' }}>
                    {selectedProduct.price}
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: '1.6', borderBottom: '1px solid var(--gray-100)', paddingBottom: '16px' }}>
                  {selectedProduct.description}
                </p>

                {/* Specs Lists */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Info size={16} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>주요 성분:</strong> <span style={{ color: 'var(--gray-700)' }}>{selectedProduct.ingredients}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Clock size={16} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>빵 나오는 시간:</strong> <span style={{ color: 'var(--gray-700)' }}>{selectedProduct.bakeTime}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <AlertTriangle size={16} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>알레르기 정보:</strong> <span style={{ color: 'var(--gray-700)' }}>{selectedProduct.allergens}</span>
                      <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginTop: '2px' }}>{selectedProduct.nutrition}</div>
                    </div>
                  </div>
                </div>

                {/* Action CTA buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--gray-100)', paddingTop: '20px' }}>
                  <Button 
                    variant="outline" 
                    style={{ flex: 1, padding: '12px' }}
                    onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                    icon={<Heart size={16} fill={wishlist.includes(selectedProduct.id) ? 'var(--accent-rust)' : 'none'} style={{ color: wishlist.includes(selectedProduct.id) ? 'var(--accent-rust)' : 'currentColor' }} />}
                  >
                    위시리스트
                  </Button>
                  <Button 
                    variant="primary" 
                    style={{ flex: 2, padding: '12px' }}
                    onClick={() => { alert(`${selectedProduct.title}이 장바구니에 담겼습니다.`); setSelectedProduct(null); }}
                    icon={<ShoppingCart size={16} />}
                  >
                    장바구니 담기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cat-tab-btn:hover {
          background-color: var(--primary-gold-light) !important;
          color: var(--secondary-brown) !important;
        }
        .wish-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

export default ProductCatalog;
export { PRODUCTS_DATA };
