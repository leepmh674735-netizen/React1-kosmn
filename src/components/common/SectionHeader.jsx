import React from 'react';

function SectionHeader({ upperTitle, title, description, style = {} }) {
  return (
    <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px', ...style }}>
      {upperTitle && (
        <span 
          className="font-serif" 
          style={{ 
            fontSize: '14px', 
            color: 'var(--primary-gold)', 
            fontWeight: '700', 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '4px'
          }}
        >
          {upperTitle}
        </span>
      )}
      {title && <h2 className="text-gradient" style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0 10px 0' }}>{title}</h2>}
      {description && <p style={{ fontSize: '14px', color: 'var(--gray-600)', margin: '0' }}>{description}</p>}
      <div 
        className="divider" 
        style={{ 
          width: '60px', 
          height: '3px', 
          background: 'var(--primary-gold)', 
          margin: '16px auto 0 auto', 
          borderRadius: 'var(--radius-full)' 
        }}
      ></div>
    </div>
  );
}

export default SectionHeader;
