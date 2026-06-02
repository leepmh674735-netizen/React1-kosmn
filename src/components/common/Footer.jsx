import React from 'react';
import { Mail, Instagram, MessageCircle, MapPin, Phone, Clock } from 'lucide-react';

function Footer() {
  const footerStyle = {
    backgroundColor: 'var(--bg-coffee)',
    color: 'var(--bg-cream)',
    padding: '64px 0 32px 0',
    marginTop: 'auto',
    borderTop: '3px solid var(--primary-gold)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '48px',
  };

  const logoSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const logoTitleStyle = {
    fontFamily: 'var(--font-serif)',
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--primary-gold)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const headingStyle = {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '20px',
    color: 'var(--primary-gold)',
    position: 'relative',
    display: 'inline-block',
  };

  const infoListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontSize: '14px',
    opacity: 0.85,
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition-fast)',
  };

  const subscribeButtonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--primary-gold)',
    color: 'var(--bg-coffee)',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  };

  const socialIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--bg-cream)',
    transition: 'var(--transition-fast)',
  };

  return (
    <footer style={footerStyle}>
      <div className="container">
        <div style={gridStyle}>
          {/* Brand Info Column */}
          <div style={logoSectionStyle}>
            <div style={logoTitleStyle}>
              <span>🍞</span>
              <span>Wheat Atelier</span>
            </div>
            <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: '1.6' }}>
              매일 아침 천연 유산균 발효종과 최고급 유기농 밀가루로 건강하고 깊은 풍미의 프리미엄 식빵을 구워내는 아틀리에입니다.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a href="#" style={socialIconStyle} className="social-btn" title="인스타그램">
                <Instagram size={20} />
              </a>
              <a href="#" style={socialIconStyle} className="social-btn" title="카카오톡 플러스친구">
                <MessageCircle size={20} />
              </a>
              <a href="#" style={socialIconStyle} className="social-btn" title="이메일">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 style={headingStyle}>아틀리에 매장 정보</h4>
            <ul style={infoListStyle}>
              <li style={infoItemStyle}>
                <MapPin size={18} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '2px' }} />
                <span>서울시 강남구 신사동 123-45, 골든밀 빌딩 1층 (지하철 압구정역 3번 출구 도보 5분)</span>
              </li>
              <li style={infoItemStyle}>
                <Phone size={18} style={{ color: 'var(--primary-gold)', flexShrink: 0 }} />
                <span>02-123-4567</span>
              </li>
              <li style={infoItemStyle}>
                <Clock size={18} style={{ color: 'var(--primary-gold)', flexShrink: 0 }} />
                <span>
                  매일 08:00 - 20:00<br />
                  <span style={{ fontSize: '12px', color: 'var(--primary-gold)' }}>
                    * 당일 생산한 빵이 소진되면 조기 영업 마감합니다.
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Business Policy / Menu Links Column */}
          <div>
            <h4 style={headingStyle}>고객 서비스 및 예약</h4>
            <ul style={{ ...infoListStyle, gap: '16px' }}>
              <li><a href="#" style={{ transition: 'var(--transition-fast)' }} className="footer-link">단체 주문 문의</a></li>
              <li><a href="#" style={{ transition: 'var(--transition-fast)' }} className="footer-link">베이킹 클래스 예약</a></li>
              <li><a href="#" style={{ transition: 'var(--transition-fast)' }} className="footer-link">알레르기 유발 성분 안내</a></li>
              <li><a href="#" style={{ transition: 'var(--transition-fast)' }} className="footer-link">개인정보처리방침</a></li>
            </ul>
          </div>

          {/* Newsletter Subscribe Column */}
          <div>
            <h4 style={headingStyle}>뉴스레터 구독</h4>
            <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>
              밀아틀리에의 신제품 소식, 당일 빵 굽는 타임테이블, 특별 이벤트 정보를 이메일로 받아보세요.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('뉴스레터 구독 신청이 완료되었습니다.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="email" placeholder="이메일 주소를 입력하세요" required style={inputStyle} className="subscribe-input" />
              <button type="submit" style={subscribeButtonStyle} className="subscribe-btn">구독하기</button>
            </form>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            textAlign: 'center',
            fontSize: '13px',
            opacity: 0.6,
          }}
        >
          &copy; {new Date().getFullYear()} Wheat Atelier. All Rights Reserved. Designed for Bakery Perfection.
        </div>
      </div>
      
      <style>{`
        .social-btn:hover {
          background-color: var(--primary-gold) !important;
          color: var(--bg-coffee) !important;
          transform: translateY(-3px);
        }
        .footer-link:hover {
          color: var(--primary-gold) !important;
          padding-left: 4px;
        }
        .subscribe-input:focus {
          border-color: var(--primary-gold) !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .subscribe-btn:hover {
          background-color: var(--primary-gold-hover) !important;
          box-shadow: 0 4px 12px rgba(217, 160, 91, 0.3);
        }
      `}</style>
    </footer>
  );
}

export default Footer;
