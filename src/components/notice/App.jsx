import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NoticeList from './list';
import NoticeDetail from './sub';
import NoticeWrite from './NoticeWrite';

function NoticeApp() {
  return (
    <Routes>
      <Route path="/" element={<NoticeList />} />
      <Route path="/write" element={<NoticeWrite />} />
      <Route path="/:id" element={<NoticeDetail />} />
    </Routes>
  );
}

export default NoticeApp;
export { NoticeList, NoticeDetail, NoticeWrite };