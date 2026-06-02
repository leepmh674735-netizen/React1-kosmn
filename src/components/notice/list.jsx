import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Pin, MessageSquare, Plus, Calendar, User, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import SectionHeader from '../common/SectionHeader';

// Mock Notices for fallback/design display
const MOCK_NOTICES = [
  {
    id: 1,
    title: '🌾 [신제품] 24시간 천연 효모 슬로우 발효 "골든 허니 식빵" 출시 기념 20% 할인 이벤트',
    content: '밀아틀리에의 마스터 베이커가 24시간 저온 숙성시킨 천연 효모와 천연 아카시아 벌꿀을 넣어 구워낸 신제품 "골든 허니 식빵"이 출시되었습니다. 껍질까지 쫄깃하고 속은 부드러운 최상의 식감을 경험해보세요. 출시 기념 일주일간 20% 할인 혜택이 적용됩니다.',
    author: '아틀리에 마스터',
    category: '이벤트',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: true
  },
  {
    id: 2,
    title: '📢 [안내] 6월 상반기 베이킹 원데이 클래스 "나만의 식빵 굽기" 수강생 모집',
    content: '매월 조기 마감되는 밀아틀리에 인기 강좌인 베이킹 원데이 클래스가 6월에도 찾아옵니다. 직접 반죽부터 오븐 베이킹까지 전문 파티시에의 밀착 지도로 나만의 인생 식빵을 만들어 볼 수 있는 기회입니다. 선착순 12명으로 모집 진행되오니 서둘러 신청해주세요.',
    author: '교육팀',
    category: '일반',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: true
  },
  {
    id: 3,
    title: '⚠️ [공지] 프랑스산 AOP 레스큐어 버터 수급 차질로 인한 일부 품목 한정 수량 생산 안내',
    content: '밀아틀리에 식빵의 풍미를 결정하는 가장 핵심 원료인 프랑스산 AOP 레스큐어 버터의 수입 통관 지연으로 인해 일시적으로 수급에 차질이 생겼습니다. 원자료 품질 타협 없이 프리미엄 식빵 생산을 고수하기 위해 버터 식빵 라인은 당분간 하루 50개 한정 수량으로 생산되오니 방문 시 참고 부탁드립니다.',
    author: '아틀리에 대표',
    category: '중요',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false
  },
  {
    id: 4,
    title: '🥐 [이벤트] 인스타그램 방문 인증샷 & 리뷰 이벤트 (무료 커피 쿠폰 증정)',
    content: '밀아틀리에 매장에 방문하셔서 갓 구워낸 식빵 사진과 함께 해시태그(#밀아틀리에, #압구정식빵)를 달아 인스타그램에 업로드해주시는 모든 고객님들께 아틀리에 블렌드 아메리카노 무료 쿠폰을 드립니다. 매장 직원에게 포스팅을 인증해주세요!',
    author: '마케팅팀',
    category: '이벤트',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false
  }
];

function NoticeList() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  useEffect(() => {
    // Attempt to fetch from Spring Boot backend
    fetch("http://localhost:8080/notice/list")
      .then(response => {
        if (!response.ok) {
          throw new Error("네트워크 상태가 원활하지 않습니다.");
        }
        return response.json();
      })
      .then(data => {
        // If data from DB is empty, load mock data to display design
        if (data && data.length > 0) {
          setNotices(data);
        } else {
          setNotices(MOCK_NOTICES);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend not running or error, falling back to mock notices:", err);
        setNotices(MOCK_NOTICES);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Filter notices by category and search query
  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort: pinned notices first, then by date/id descending
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getCategoryBadgeStyle = (category) => {
    const base = {
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '11px',
      fontWeight: '700'
    };

    switch(category) {
      case '중요':
        return { ...base, backgroundColor: '#ffe3e3', color: 'var(--accent-rust)' };
      case '이벤트':
        return { ...base, backgroundColor: 'var(--primary-gold-light)', color: 'var(--secondary-brown)' };
      case '일반':
      default:
        return { ...base, backgroundColor: 'var(--gray-100)', color: 'var(--gray-700)' };
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '1000px' }}>
      {/* Section Header */}
      <SectionHeader 
        upperTitle="Notice & Event"
        title="밀아틀리에 소식"
        description="매장의 새로운 이벤트 정보와 베이킹 일정을 가장 먼저 만나보세요."
      />

      {/* Board Utility Area */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '16px',
          marginBottom: '24px' 
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['전체', '일반', '이벤트', '중요'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: selectedCategory === cat ? '1px solid var(--primary-gold)' : '1px solid var(--gray-300)',
                backgroundColor: selectedCategory === cat ? 'var(--primary-gold)' : '#ffffff',
                color: selectedCategory === cat ? 'var(--bg-coffee)' : 'var(--gray-700)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Write Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-300)',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/notice/write')}
            icon={<Plus size={16} />}
            style={{ padding: '10px 18px', flexShrink: 0 }}
          >
            공지 등록
          </Button>
        </div>
      </div>

      {/* Main Notice List */}
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--gray-500)' }}>
          <div className="spinner" style={{ margin: '0 auto 16px auto', width: '28px', height: '28px' }}></div>
          소식을 불러오는 중입니다...
        </div>
      ) : sortedNotices.length === 0 ? (
        <div style={{ padding: '80px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => navigate(`/notice/${notice.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 28px',
                backgroundColor: notice.isPinned ? '#fdf8f2' : '#ffffff',
                border: notice.isPinned ? '1px dashed var(--primary-gold)' : '1px solid rgba(60, 42, 33, 0.06)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="notice-item-row"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, paddingRight: '20px' }}>
                {/* Pin Icon for pinned posts */}
                {notice.isPinned ? (
                  <div style={{ color: 'var(--accent-rust)', display: 'flex', alignItems: 'center' }} title="공지사항 고정">
                    <Pin size={18} fill="var(--accent-rust)" />
                  </div>
                ) : (
                  <div style={{ color: 'var(--gray-400)', fontSize: '14px', width: '18px', textAlign: 'center', fontWeight: '600' }}>
                    {notice.id}
                  </div>
                )}

                {/* Category & Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={getCategoryBadgeStyle(notice.category)}>
                      {notice.category}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '15px', 
                        fontWeight: notice.isPinned ? '700' : '600', 
                        color: 'var(--bg-coffee)',
                        lineHeight: '1.4'
                      }}
                    >
                      {notice.title}
                    </span>
                  </div>
                  
                  {/* Meta items */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--gray-500)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <User size={12} /> {notice.author}
                    </span>
                    <span>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Calendar size={12} /> {formatDate(notice.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight size={18} style={{ color: 'var(--gray-400)', flexShrink: 0 }} className="arrow-icon" />
            </div>
          ))}
        </div>
      )}

      <style>{`
        .notice-item-row:hover {
          transform: translateY(-2px);
          border-color: var(--primary-gold) !important;
          box-shadow: var(--shadow-md) !important;
        }
        .notice-item-row:hover .arrow-icon {
          color: var(--primary-gold) !important;
          transform: translateX(4px);
        }
        .arrow-icon {
          transition: var(--transition-fast);
        }
      `}</style>
    </div>
  );
}

export default NoticeList;
export { MOCK_NOTICES }; // export mock data for details page usage