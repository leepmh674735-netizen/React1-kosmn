import React from 'react';

function AuthLayout({ title, description, children }) {
  // Mobile First Styles: default to full-width container with moderate padding
  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <span className="auth-logo-emoji">🍞</span>
          {title && <h3 className="text-gradient auth-title">{title}</h3>}
          {description && <p className="auth-description">{description}</p>}
        </div>

        {/* Card Body */}
        <div className="auth-body">
          {children}
        </div>
      </div>

      <style>{`
        /* Mobile First (Base) Styles */
        .auth-container {
          padding: 30px 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 180px);
          width: 100%;
        }

        .auth-card {
          background-color: var(--bg-milk);
          border-radius: var(--radius-lg);
          padding: 24px 20px;
          width: 100%;
          max-width: 100%;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(60, 42, 33, 0.08);
          transition: var(--transition-normal);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-logo-emoji {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
          animation: bounce 2s infinite ease-in-out;
        }

        .auth-title {
          font-size: 20px;
          fontWeight: 800;
          margin-top: 4px;
          margin-bottom: 6px;
        }

        .auth-description {
          font-size: 12px;
          color: var(--gray-600);
          line-height: 1.4;
        }

        .auth-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        /* Desktop & Tablet overrides (min-width: 480px) */
        @media (min-width: 480px) {
          .auth-container {
            padding: 60px 24px;
          }
          
          .auth-card {
            padding: 40px;
            max-width: 460px;
          }

          .auth-title {
            font-size: 24px;
          }

          .auth-description {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default AuthLayout;
