import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    transition: 'var(--transition-normal)',
    padding: isScrolled ? '16px 0' : '24px 0',
    backgroundColor: isScrolled ? 'rgba(247, 239, 229, 0.85)' : 'transparent',
    borderBottom: isScrolled ? '1px solid rgba(217, 160, 91, 0.15)' : '1px solid transparent',
    backdropFilter: isScrolled ? 'var(--glass-blur)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'var(--glass-blur)' : 'none',
  };

  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle = {
    fontFamily: 'var(--font-serif)',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: 'var(--bg-coffee)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const menuStyle = {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  };

  const navLinkClass = ({ isActive }) => {
    return {
      fontSize: '15px',
      fontWeight: isActive ? '700' : '500',
      color: isActive ? 'var(--secondary-brown)' : 'var(--bg-coffee)',
      position: 'relative',
      padding: '4px 0',
      transition: 'var(--transition-fast)',
      borderBottom: isActive ? '2px solid var(--primary-gold)' : '2px solid transparent',
    };
  };

  const rightIconsStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  };

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--bg-coffee)',
    transition: 'var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  };

  return (
    <header style={headerStyle}>
      <div className="container" style={navContainerStyle}>
        {/* Brand Logo */}
        <Link to="/" style={logoStyle}>
          <span style={{ fontSize: '28px' }}>🍞</span>
          <span className="text-gradient">Wheat Atelier</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-only" style={menuStyle}>
          <NavLink to="/products" style={({ isActive }) => navLinkClass({ isActive })}>
            상품소개
          </NavLink>
          <NavLink to="/notice" style={({ isActive }) => navLinkClass({ isActive })}>
            공지사항
          </NavLink>
          <NavLink to="/qna" style={({ isActive }) => navLinkClass({ isActive })}>
            Q&A 게시판
          </NavLink>
          <NavLink to="/member" style={({ isActive }) => navLinkClass({ isActive })}>
            회원관리
          </NavLink>
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="desktop-only" style={rightIconsStyle}>
          <Link to="/member/mypage" style={iconButtonStyle} title="마이페이지">
            <User size={20} />
          </Link>
          <button style={iconButtonStyle} title="장바구니">
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-only" 
          style={{ ...iconButtonStyle, border: 'none', background: 'none' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-only fade-in" 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-cream)',
            borderBottom: '1px solid var(--gray-200)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 999,
          }}
        >
          <NavLink 
            to="/products" 
            style={({ isActive }) => ({ ...navLinkClass({ isActive }), display: 'block', fontSize: '18px', padding: '8px 0' })}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            상품소개
          </NavLink>
          <NavLink 
            to="/notice" 
            style={({ isActive }) => ({ ...navLinkClass({ isActive }), display: 'block', fontSize: '18px', padding: '8px 0' })}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            공지사항
          </NavLink>
          <NavLink 
            to="/qna" 
            style={({ isActive }) => ({ ...navLinkClass({ isActive }), display: 'block', fontSize: '18px', padding: '8px 0' })}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Q&A 게시판
          </NavLink>
          <NavLink 
            to="/member" 
            style={({ isActive }) => ({ ...navLinkClass({ isActive }), display: 'block', fontSize: '18px', padding: '8px 0' })}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            회원관리
          </NavLink>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', borderTop: '1px solid var(--gray-200)', paddingTop: '16px' }}>
            <Link 
              to="/member/mypage" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--bg-coffee)', fontSize: '16px', fontWeight: '500' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={20} /> 마이페이지
            </Link>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--bg-coffee)', fontSize: '16px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <ShoppingBag size={20} /> 장바구니
            </button>
          </div>
        </div>
      )}

      {/* Basic Mobile Responsive Inject */}
      <style>{`
        .desktop-only {
          display: flex;
        }
        .mobile-only {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
