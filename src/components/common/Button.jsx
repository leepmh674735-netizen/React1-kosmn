import React from 'react';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // 'primary', 'secondary', 'outline', 'text'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style = {} 
}) {
  const getPadding = () => {
    switch(size) {
      case 'sm': return '8px 16px';
      case 'lg': return '14px 32px';
      case 'md':
      default: return '10px 24px';
    }
  };

  const getFontSize = () => {
    switch(size) {
      case 'sm': return '13px';
      case 'lg': return '16px';
      case 'md':
      default: return '14px';
    }
  };

  const getColors = () => {
    if (disabled || loading) {
      return {
        bg: 'var(--gray-300)',
        color: 'var(--gray-600)',
        border: '1px solid var(--gray-300)',
      };
    }

    switch(variant) {
      case 'secondary':
        return {
          bg: 'var(--secondary-brown)',
          color: 'var(--bg-cream)',
          border: '1px solid var(--secondary-brown)',
          hoverBg: 'var(--secondary-brown-hover)',
          hoverColor: 'var(--bg-cream)',
        };
      case 'outline':
        return {
          bg: 'transparent',
          color: 'var(--secondary-brown)',
          border: '1px solid var(--secondary-brown)',
          hoverBg: 'var(--primary-gold-light)',
          hoverColor: 'var(--secondary-brown)',
        };
      case 'text':
        return {
          bg: 'transparent',
          color: 'var(--bg-coffee)',
          border: '1px solid transparent',
          hoverBg: 'rgba(60, 42, 33, 0.05)',
          hoverColor: 'var(--secondary-brown)',
        };
      case 'primary':
      default:
        return {
          bg: 'var(--primary-gold)',
          color: 'var(--bg-coffee)',
          border: '1px solid var(--primary-gold)',
          hoverBg: 'var(--primary-gold-hover)',
          hoverColor: 'var(--bg-coffee)',
        };
    }
  };

  const colors = getColors();

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: getPadding(),
    fontSize: getFontSize(),
    fontWeight: '700',
    borderRadius: 'var(--radius-md)',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    transition: 'var(--transition-fast)',
    backgroundColor: colors.bg,
    color: colors.color,
    border: colors.border,
    boxShadow: variant === 'primary' && !disabled ? '0 4px 14px rgba(217, 160, 91, 0.25)' : 'none',
    outline: 'none',
    ...style
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    if (colors.hoverBg) e.currentTarget.style.backgroundColor = colors.hoverBg;
    if (colors.hoverColor) e.currentTarget.style.color = colors.hoverColor;
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(217, 160, 91, 0.35)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    e.currentTarget.style.backgroundColor = colors.bg;
    e.currentTarget.style.color = colors.color;
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 4px 14px rgba(217, 160, 91, 0.25)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          <span>불러오는 중...</span>
        </>
      ) : (
        <>
          {icon && <span style={{ display: 'flex' }}>{icon}</span>}
          {children}
        </>
      )}

      {/* Embedded spinner styles */}
      <style>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top: 2.5px solid currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}

export default Button;
