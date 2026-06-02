import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './components/home/Home';
import ProductCatalog from './components/product/ProductCatalog';
import NoticeApp from './components/notice/App';
import QnaBoard from './components/qna/QnaBoard';
import MemberManage from './components/member/MemberManage';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Main Home Route */}
        <Route path="/" element={<Home />} />

        {/* Product Catalog Route */}
        <Route path="/products" element={<ProductCatalog />} />

        {/* Notice Board Routes (Nested) */}
        <Route path="/notice/*" element={<NoticeApp />} />

        {/* Q&A Board Routes (Nested) */}
        <Route path="/qna/*" element={<QnaBoard />} />

        {/* Member Management Routes (Nested) */}
        <Route path="/member/*" element={<MemberManage />} />
        
        {/* Wildcard Fallback: Redirect to Home or render NotFound */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default App;
