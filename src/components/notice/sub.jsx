import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import { MOCK_NOTICES } from './list';

function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Attempt to fetch from backend
    fetch(`http://localhost:8080/notice/detail?id=${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("공지사항 상세조회 실패");
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setNotice(data);
        } else {
          // Find in mock data if empty
          findInMock(id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend detail fetch error, checking mock notices:", err);
        findInMock(id);
        setLoading(false);
      });
  }, [id]);

  const findInMock = (noticeId) => {
    const mockId = parseInt(noticeId, 10);
    const mockNotice = MOCK_NOTICES.find(n => n.id === mockId);
    if (mockNotice) {
      setNotice(mockNotice);
      setError(null);
    } else {
      setError("요청하신 공지사항을 찾을 수 없습니다.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getCategoryBadgeStyle = (category) => {
    const base = {
      padding: '4px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: '12px',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    };

    switch(category) {
      case '중요':
        return { ...base, backgroundColor: '#ffe3e3', color: 'var(--accent-rust)' };
      case '이벤트':
        return { ...base, backgroundColor: 'var(--primary-gold-light)', color: 'var(--secondary-brown)' };
      case '일반':
      default:
        return { ...base, backgroundColor: 'var(--gray-100)', color: 'var(--gray-700)' };
    }
  };

  // Find next/prev for pagination links
  const currentId = parseInt(id, 10);
  const prevNotice = MOCK_NOTICES.find(n => n.id === currentId - 1);
  const nextNotice = MOCK_NOTICES.find(n => n.id === currentId + 1);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '800px' }}>
        <div className="spinner" style={{ margin: '0 auto 16px auto', width: '28px', height: '28px' }}></div>
        내용을 불러오는 중입니다...
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '800px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--accent-rust)', fontWeight: '700', fontSize: '18px', marginBottom: '16px' }}>오류 안내</p>
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>{error || '공지사항이 존재하지 않습니다.'}</p>
          <Button variant="outline" onClick={() => navigate('/notice')} icon={<ArrowLeft size={16} />}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      {/* Back button */}
      <button 
        onClick={() => navigate('/notice')} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--gray-600)',
          fontWeight: '600',
          fontSize: '14px',
          marginBottom: '20px',
          transition: 'var(--transition-fast)'
        }}
        className="back-btn"
      >
        <ArrowLeft size={16} /> 목록으로 돌아가기
      </button>

      {/* Main Detail Card */}
      <div 
        style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-lg)', 
          padding: '40px', 
          border: '1px solid rgba(60, 42, 33, 0.08)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '24px'
        }}
      >
        {/* Header Metadata */}
        <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span style={getCategoryBadgeStyle(notice.category)}>
              <Tag size={12} /> {notice.category}
            </span>
            {notice.isPinned && (
              <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(217, 160, 91, 0.1)', color: 'var(--secondary-brown)', fontSize: '11px', fontWeight: '700' }}>
                📌 상단 고정 공지
              </span>
            )}
          </div>
          
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--bg-coffee)', marginBottom: '16px', lineHeight: '1.4' }}>
            {notice.title}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--gray-500)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} style={{ color: 'var(--primary-gold)' }} /> <strong>작성자:</strong> {notice.author}
            </span>
            <span>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} style={{ color: 'var(--primary-gold)' }} /> <strong>작성일:</strong> {formatDate(notice.createdAt)}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div 
          style={{ 
            fontSize: '16px', 
            lineHeight: '1.8', 
            color: 'var(--gray-800)', 
            whiteSpace: 'pre-wrap',
            minHeight: '260px',
            paddingBottom: '24px'
          }}
        >
          {notice.content}
        </div>
      </div>

      {/* Prev / Next Navigation Links */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          border: '1px solid var(--gray-200)', 
          borderRadius: 'var(--radius-md)', 
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Next notice row */}
        {nextNotice ? (
          <div 
            onClick={() => navigate(`/notice/${nextNotice.id}`)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '14px 20px', 
              cursor: 'pointer', 
              fontSize: '13px',
              borderBottom: '1px solid var(--gray-100)',
              transition: 'var(--transition-fast)'
            }}
            className="nav-row"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: 'var(--primary-gold)', width: '80px', flexShrink: 0 }}>
              <ChevronLeft size={16} /> 다음글
            </span>
            <span style={{ color: 'var(--bg-coffee)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextNotice.title}
            </span>
          </div>
        ) : null}

        {/* Prev notice row */}
        {prevNotice ? (
          <div 
            onClick={() => navigate(`/notice/${prevNotice.id}`)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '14px 20px', 
              cursor: 'pointer', 
              fontSize: '13px',
              transition: 'var(--transition-fast)'
            }}
            className="nav-row"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: 'var(--primary-gold)', width: '80px', flexShrink: 0 }}>
              <ChevronRight size={16} /> 이전글
            </span>
            <span style={{ color: 'var(--bg-coffee)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {prevNotice.title}
            </span>
          </div>
        ) : null}
      </div>

      {/* Footer Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outline" 
          onClick={() => navigate('/notice')}
          icon={<ArrowLeft size={16} />}
          style={{ padding: '12px 30px' }}
        >
          목록 보기
        </Button>
      </div>

      <style>{`
        .back-btn:hover {
          color: var(--primary-gold) !important;
          transform: translateX(-2px);
        }
        .nav-row:hover {
          background-color: var(--gray-50) !important;
        }
        .nav-row:hover span:last-child {
          color: var(--primary-gold) !important;
        }
      `}</style>
    </div>
  );
}

export default NoticeDetail;