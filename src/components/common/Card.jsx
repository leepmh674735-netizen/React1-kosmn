import React from 'react';

function Card({ 
  image, 
  title, 
  subtitle, 
  tags = [], 
  price, 
  badge, 
  children, 
  onClick, 
  variant = 'default', // 'default', 'glass', 'notice', 'product'
  style = {}
}) {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 'var(--radius-md)',
    backgroundColor: variant === 'glass' ? 'rgba(255, 255, 255, 0.6)' : 'var(--bg-milk)',
    border: '1px solid rgba(60, 42, 33, 0.08)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition-normal)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    height: '100%',
    ...style
  };

  const imageWrapperStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: '75%', // 4:3 aspect ratio
    backgroundColor: 'var(--primary-gold-light)',
    overflow: 'hidden',
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition-slow)',
  };

  const badgeStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--accent-rust)',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    zIndex: 1,
    boxShadow: '0 2px 6px rgba(210, 93, 56, 0.3)',
  };

  const bodyStyle = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--bg-coffee)',
    marginBottom: '6px',
    lineHeight: '1.4',
  };

  const subtitleStyle = {
    fontSize: '13px',
    color: 'var(--gray-600)',
    marginBottom: '12px',
  };

  const tagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px',
  };

  const tagStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--secondary-brown)',
    backgroundColor: 'var(--primary-gold-light)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-sm)',
  };

  const footerStyle = {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--gray-100)',
  };

  const priceStyle = {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--secondary-brown)',
  };

  return (
    <div 
      className="card-component hover-scale" 
      style={cardStyle}
      onClick={onClick}
    >
      {/* Badge (e.g. Best, New, Hot) */}
      {badge && <div style={badgeStyle}>{badge}</div>}

      {/* Thumbnail Image */}
      {image && (
        <div style={imageWrapperStyle}>
          <img 
            src={image} 
            alt={title} 
            style={imageStyle} 
            className="card-image"
          />
        </div>
      )}

      {/* Content Body */}
      <div style={bodyStyle}>
        {title && <h3 style={titleStyle}>{title}</h3>}
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div style={tagsContainerStyle}>
            {tags.map((tag, idx) => (
              <span key={idx} style={tagStyle}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Custom content */}
        {children && <div style={{ flex: 1 }}>{children}</div>}

        {/* Price & Footer Actions */}
        {(price || variant === 'product') && (
          <div style={footerStyle}>
            {price && <span style={priceStyle}>{price}</span>}
            <span style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: '700' }}>상세 보기 &rarr;</span>
          </div>
        )}
      </div>

      <style>{`
        .card-component:hover {
          border-color: var(--primary-gold) !important;
        }
        .card-component:hover .card-image {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
}

export default Card;
