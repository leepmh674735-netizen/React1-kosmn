import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, Sparkles, LogOut } from 'lucide-react';
import Button from '../common/Button';
import SectionHeader from '../common/SectionHeader';

function MyPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="container fade-in" style={{ padding: '40px 24px', maxWidth: '900px' }}>
      <SectionHeader 
        upperTitle="MY ATELIER"
        title="마이 페이지"
        description="고객님의 예약 내역, 적립 등급, 쿠폰 등을 한눈에 확인하세요."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* User Status Profile Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '30px', border: '1px solid rgba(60, 42, 33, 0.08)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-gold-light)', color: 'var(--secondary-brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <User size={40} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--bg-coffee)' }}>{user.name} 님</h3>
          <p style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '16px' }}>{user.email}</p>
          
          {/* Member Level Badge */}
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: 'var(--bg-coffee)', 
              color: 'var(--primary-gold)', 
              padding: '6px 16px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '12px', 
              fontWeight: '700',
              marginBottom: '24px'
            }}
          >
            <Award size={14} /> {user.level}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--gray-100)', paddingTop: '20px', marginBottom: '24px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray-500)', marginBottom: '4px' }}>누적 포인트</span>
              <strong style={{ fontSize: '18px', color: 'var(--secondary-brown)' }}>{user.points.toLocaleString()}P</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray-500)', marginBottom: '4px' }}>가입 일자</span>
              <strong style={{ fontSize: '14px', color: 'var(--bg-coffee)', display: 'block', marginTop: '3px' }}>{user.joinedAt}</strong>
            </div>
          </div>

          <Button variant="outline" fullWidth onClick={onLogout} style={{ borderStyle: 'dashed' }}>
            로그아웃
          </Button>
        </div>

        {/* User Activities Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 2 }}>
          
          {/* Loyalty Level Benefits */}
          <div style={{ backgroundColor: '#fcfaf7', border: '1px solid rgba(217, 160, 91, 0.2)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--secondary-brown)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Sparkles size={16} /> 특별 멤버십 혜택
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--gray-700)', lineHeight: '1.6' }}>
              고객님은 현재 <strong style={{ color: 'var(--secondary-brown)' }}>{user.level}</strong> 단계입니다. 매 결제 시 <strong style={{ color: 'var(--primary-gold-hover)' }}>5% 추가 적립</strong> 및 당일 예약 선결제 우선권이 주어집니다. 3회 더 구매하시면 다음 등급으로 승격되어 웰컴 무료 식빵 쿠폰 1매가 발급됩니다.
            </p>
          </div>

          {/* Activity Logs (Mock Listings) */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(60, 42, 33, 0.06)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--bg-coffee)', marginBottom: '16px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
              최근 1:1 질문 내역
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                onClick={() => navigate('/qna/1')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  backgroundColor: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
                className="qna-shortcut-item"
              >
                <span style={{ fontWeight: '600', color: 'var(--bg-coffee)' }}>단체 주문(식빵 100개) 배송 및 할인이 가능한가요?</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--secondary-brown)' }}>답변완료</span>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  backgroundColor: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  opacity: 0.8
                }}
              >
                <span style={{ fontWeight: '600', color: 'var(--gray-600)' }}>온라인 예약 픽업 시간 변경 및 취소 수수료 안내</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gray-500)' }}>기간만료</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" style={{ flex: 1 }} onClick={() => navigate('/products')}>
              🍞 빵 예약하러 가기
            </Button>
            <Button variant="outline" style={{ flex: 1 }} onClick={() => navigate('/qna/write')}>
              ❓ 1:1 질문하기
            </Button>
          </div>

        </div>
      </div>
      <style>{`
        .qna-shortcut-item:hover span:first-child {
          color: var(--primary-gold) !important;
        }
      `}</style>
    </div>
  );
}

export default MyPage;
