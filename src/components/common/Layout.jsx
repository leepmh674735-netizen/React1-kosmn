import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  // Automatically scroll to top when mounting a page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
  };

  const mainStyle = {
    flex: 1,
    paddingTop: '90px', // Prevent header overlap
    paddingBottom: '80px',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={layoutStyle}>
      {/* Dynamic Header */}
      <Header />

      {/* Main Page Area */}
      <main style={mainStyle} className="fade-in">
        {children}
      </main>

      {/* Structured Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
