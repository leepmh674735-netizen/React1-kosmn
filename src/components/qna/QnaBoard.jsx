import React, { useState } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, Search, Lock, Unlock, MessageSquare, ArrowLeft, Send, CheckCircle2, User, Clock, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import SectionHeader from '../common/SectionHeader';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import TextAreaField from '../common/TextAreaField';

// Mock Q&A Data
const INITIAL_QNA = [
  {
    id: 1,
    title: '단체 주문(식빵 100개) 배송 및 할인이 가능한가요?',
    content: '안녕하세요. 유치원 아침 행사용으로 시그니처 생 밀크 식빵 100개를 주문하고자 합니다. 혹시 대량 주문 시 배송 지원 및 추가 할인이 적용되는지 문의드립니다. 날짜는 다음 달 12일 아침 8시까지 배달이 완료되어야 합니다.',
    author: '김하은',
    category: '단체주문',
    createdAt: '2026-05-27 10:15',
    isSecret: false,
    status: '답변완료',
    answer: {
      author: '밀아틀리에 매니저',
      createdAt: '2026-05-27 14:30',
      content: '안녕하세요 김하은 고객님! 밀아틀리에를 찾아주셔서 감사합니다. \n\n식빵 100개 이상 대량 주문 시 서울 전 지역 무료 직배송(희망하시는 오전 8시 전 정시 배송 가능)을 지원해 드리고 있으며, 총 결제 금액의 10% 단체 할인 혜택을 드리고 있습니다. \n\n다만 원료 준비 및 오븐 타임 배정을 위해 최소 행사 일주일 전까지는 매장으로 유선 연락(02-123-4567)을 주셔서 주문서 작성을 완료해주셔야 합니다. 추가적인 요청사항이 있으시면 언제든지 편하게 문의주세요. 감사합니다!'
    }
  },
  {
    id: 2,
    title: '천연 발효 슬로우 식빵에 견과류가 함유되어 있나요?',
    content: '아이가 견과류 알레르기가 있어서 꼼꼼하게 확인 중입니다. 24h 천연 발효 슬로우 식빵 성분표를 보니 견과류 관련 언급은 없는데, 혹시 같은 오븐에서 견과류가 들어간 빵(통밀 무화과 등)을 구워서 교차 오염 가능성이 있는지 여쭙고 싶습니다.',
    author: '박성민',
    category: '성분문의',
    createdAt: '2026-05-26 15:40',
    isSecret: true,
    password: '1234',
    status: '답변완료',
    answer: {
      author: '마스터 베이커',
      createdAt: '2026-05-26 18:20',
      content: '안녕하세요 박성민 고객님. 소중한 자녀분의 안전을 위해 문의해주셔서 감사합니다. \n\n질문하신 "24h 천연 발효 슬로우 식빵"의 반죽 자체에는 땅콩, 호두, 피칸 등 견과류 원자료가 전혀 포함되지 않습니다. \n\n다만, 저희 아틀리에 작업장 내에서 견과류가 함유된 빵(무화과 호두 식빵 등)도 함께 수제로 생산되고 있으며, 동일한 오븐과 베이킹 트레이를 세척 후 순차적으로 사용하고 있습니다. 따라서 미세한 교차 오염 가능성을 완전히 배제할 수는 없으므로, 아주 미량의 견과류에도 심각한 반응을 일으키는 중증 알레르기 체질인 경우 구매에 다소 신중을 기하실 것을 권장해 드립니다. 고객님께 안전하고 정직한 정보만을 제공할 것을 약속드립니다.'
    }
  },
  {
    id: 3,
    title: '베이킹 클래스 예약 취소 및 환불 규정 문의',
    content: '6월 첫째 주 주말 베이킹 원데이 클래스를 예약했는데, 갑작스러운 회사 출장 일정이 잡혀 취소해야 할 것 같습니다. 수업 4일 전에 취소해도 전액 환불이 가능한가요?',
    author: '이윤주',
    category: '클래스',
    createdAt: '2026-05-25 09:12',
    isSecret: false,
    status: '답변대기'
  },
  {
    id: 4,
    title: '택배 배송 서비스도 진행하시나요?',
    content: '지방(부산)에 살고 있는데 밀아틀리에 식빵이 너무 맛있다고 소문이 나서 꼭 한번 먹어보고 싶습니다. 택배나 마켓컬리 같은 새벽배송으로도 입점해 있으신지, 아니면 개별 온라인 주문 배송이 가능한지 궁금합니다.',
    author: '최진우',
    category: '배송문의',
    createdAt: '2026-05-24 11:05',
    isSecret: true,
    password: '5678',
    status: '답변완료',
    answer: {
      author: '마케팅팀',
      createdAt: '2026-05-24 14:10',
      content: '안녕하세요 최진우 고객님! 멀리 부산에서 밀아틀리에 식빵에 관심을 가져주셔서 대단히 감사드립니다. \n\n현재 밀아틀리에는 인공 방존료와 첨가물 없이 100% 당일 생산된 빵만을 제공한다는 철학을 유지하기 위해 별도의 온라인 택배 배송은 운영하지 않고 있습니다. (하루 이상 경과 시 빵결의 수분이 날아가 최상의 촉촉함을 잃기 때문입니다.) \n\n대신 서울/경기 지역 일부 백화점 팝업스토어 및 매장 퀵배송(고객님 부담)만 지원하고 있습니다. 향후 전국 고객님들이 신선한 상태로 아틀리에 식빵을 맛보실 수 있는 특수 진공포장 배송 방식을 개발 중이오니, 준비되는 대로 공지사항을 통해 소식 전해드리겠습니다. 양해해 주셔서 감사합니다!'
    }
  }
];

function QnaBoard() {
  const [qnaList, setQnaList] = useState(INITIAL_QNA);

  const addNewQuestion = (newQ) => {
    setQnaList(prev => [
      {
        id: prev.length + 1,
        ...newQ,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: '답변대기'
      },
      ...prev
    ]);
  };

  return (
    <Routes>
      <Route path="/" element={<QnaList qnaList={qnaList} />} />
      <Route path="/write" element={<QnaWrite onAdd={addNewQuestion} />} />
      <Route path="/:id" element={<QnaDetail qnaList={qnaList} />} />
    </Routes>
  );
}

// 1. Q&A List Component
function QnaList({ qnaList }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, qnaId: null, inputPassword: '', error: '' });

  const categories = ['전체', '성분문의', '단체주문', '배송문의', '클래스', '기타'];

  const filteredQna = qnaList.filter(q => {
    const matchesCategory = activeCategory === '전체' || q.category === activeCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRowClick = (qna) => {
    if (qna.isSecret) {
      setPasswordModal({ isOpen: true, qnaId: qna.id, inputPassword: '', error: '' });
    } else {
      navigate(`/qna/${qna.id}`);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const qna = qnaList.find(q => q.id === passwordModal.qnaId);
    if (qna && qna.password === passwordModal.inputPassword) {
      setPasswordModal({ isOpen: false, qnaId: null, inputPassword: '', error: '' });
      navigate(`/qna/${qna.id}`);
    } else {
      setPasswordModal(prev => ({ ...prev, error: '비밀번호가 올바르지 않습니다.' }));
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '950px' }}>
      <SectionHeader 
        upperTitle="Q&A Board"
        title="질문 & 답변"
        description="식빵 원료, 단체 예약, 매장 이용 등 궁금한 점을 남겨주시면 정성껏 답변해 드립니다."
      />

      {/* Utilities */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: activeCategory === cat ? '1px solid var(--primary-gold)' : '1px solid var(--gray-300)',
                backgroundColor: activeCategory === cat ? 'var(--primary-gold)' : '#ffffff',
                color: activeCategory === cat ? 'var(--bg-coffee)' : 'var(--gray-700)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '380px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              type="text"
              placeholder="질문 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-300)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
          <Button variant="primary" onClick={() => navigate('/qna/write')}>
            문의하기
          </Button>
        </div>
      </div>

      {/* Board Table List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(60, 42, 33, 0.06)', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary-gold-light)', color: 'var(--secondary-brown)', fontWeight: '850', borderBottom: '2px solid rgba(217, 160, 91, 0.2)' }}>
              <th style={{ padding: '16px 20px', width: '80px', textAlign: 'center' }}>번호</th>
              <th style={{ padding: '16px 20px', width: '120px' }}>카테고리</th>
              <th style={{ padding: '16px 20px' }}>질문 제목</th>
              <th style={{ padding: '16px 20px', width: '120px', textAlign: 'center' }}>작성자</th>
              <th style={{ padding: '16px 20px', width: '120px', textAlign: 'center' }}>작성일</th>
              <th style={{ padding: '16px 20px', width: '100px', textAlign: 'center' }}>답변여부</th>
            </tr>
          </thead>
          <tbody>
            {filteredQna.map((q, idx) => (
              <tr 
                key={q.id}
                onClick={() => handleRowClick(q)}
                style={{ 
                  borderBottom: '1px solid var(--gray-100)', 
                  cursor: 'pointer', 
                  transition: 'var(--transition-fast)'
                }}
                className="qna-row-hover"
              >
                <td style={{ padding: '18px 20px', color: 'var(--gray-500)', textAlign: 'center' }}>{q.id}</td>
                <td style={{ padding: '18px 20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gray-100)', color: 'var(--gray-700)' }}>
                    {q.category}
                  </span>
                </td>
                <td style={{ padding: '18px 20px', fontWeight: '600', color: 'var(--bg-coffee)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {q.isSecret && <Lock size={14} style={{ color: 'var(--gray-500)' }} />}
                    <span>{q.title}</span>
                  </div>
                </td>
                <td style={{ padding: '18px 20px', color: 'var(--gray-600)', textAlign: 'center' }}>{q.author}</td>
                <td style={{ padding: '18px 20px', color: 'var(--gray-500)', textAlign: 'center' }}>{q.createdAt.split(' ')[0]}</td>
                <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                  <span 
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: q.status === '답변완료' ? 'var(--primary-gold-light)' : 'var(--gray-100)',
                      color: q.status === '답변완료' ? 'var(--secondary-brown)' : 'var(--gray-500)',
                      border: q.status === '답변완료' ? '1px solid rgba(217, 160, 91, 0.2)' : '1px solid transparent'
                    }}
                  >
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Secret Password Modal overlay */}
      {passwordModal.isOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(60, 42, 33, 0.6)', zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-brown)', marginBottom: '16px' }}>
              <Lock size={20} />
              <h4 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>비밀글 비밀번호 입력</h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '20px' }}>
              이 질문은 작성자 보호를 위한 비밀글입니다.<br />
              글 작성 시 설정한 비밀번호를 입력해주세요. <span style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>(테스트용: 1234 또는 5678)</span>
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="비밀번호 4자리"
                maxLength={4}
                value={passwordModal.inputPassword}
                onChange={(e) => setPasswordModal(prev => ({ ...prev, inputPassword: e.target.value, error: '' }))}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-300)', marginBottom: '12px', fontSize: '16px', letterSpacing: '4px', textAlign: 'center', outline: 'none'
                }}
                autoFocus
              />
              {passwordModal.error && (
                <div style={{ color: 'var(--accent-rust)', fontSize: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> {passwordModal.error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="outline" style={{ flex: 1 }} onClick={() => setPasswordModal({ isOpen: false, qnaId: null, inputPassword: '', error: '' })}>취소</Button>
                <Button variant="primary" type="submit" style={{ flex: 1 }}>확인</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .qna-row-hover:hover {
          background-color: var(--gray-50) !important;
        }
      `}</style>
    </div>
  );
}

// 2. Q&A Detail Component
function QnaDetail({ qnaList }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const qna = qnaList.find(q => q.id === parseInt(id, 10));

  if (!qna) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p>요청하신 질문 글을 찾을 수 없습니다.</p>
        <Button variant="outline" onClick={() => navigate('/qna')}>목록으로</Button>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <button onClick={() => navigate('/qna')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-600)', fontWeight: '600', marginBottom: '20px' }}>
        <ArrowLeft size={16} /> 목록으로 돌아가기
      </button>

      {/* Customer Question Card */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '36px', border: '1px solid rgba(60, 42, 33, 0.08)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
        <div style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-gold-light)', color: 'var(--secondary-brown)' }}>
              {qna.category}
            </span>
            {qna.isSecret && <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '3px' }}><Lock size={10} /> 비밀글</span>}
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--bg-coffee)' }}>Q. {qna.title}</h3>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--gray-500)', marginTop: '12px' }}>
            <span><strong>작성자:</strong> {qna.author}</span>
            <span>|</span>
            <span><strong>작성일:</strong> {qna.createdAt}</span>
          </div>
        </div>
        <div style={{ fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: 'var(--gray-800)' }}>
          {qna.content}
        </div>
      </div>

      {/* Bakery Expert Answer Card */}
      {qna.answer ? (
        <div style={{ backgroundColor: '#fcfaf7', borderRadius: 'var(--radius-lg)', padding: '36px', border: '1px solid rgba(217, 160, 91, 0.15)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '30px', backgroundColor: 'var(--secondary-brown)', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
            REPLY
          </div>
          <div style={{ borderBottom: '1px dashed rgba(60, 42, 33, 0.1)', paddingBottom: '18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--primary-gold)' }} />
              <strong style={{ fontSize: '16px', color: 'var(--secondary-brown)' }}>{qna.answer.author}</strong>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
              {qna.answer.createdAt}
            </span>
          </div>
          <div style={{ fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: 'var(--bg-coffee)' }}>
            {qna.answer.content}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--gray-50)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--gray-300)', textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px' }}>
          <Clock size={20} style={{ margin: '0 auto 8px auto', color: 'var(--gray-400)' }} />
          답변을 준비하고 있습니다. 조금만 기다려주세요.
        </div>
      )}
    </div>
  );
}

// 3. Q&A Ask Question Form Component
function QnaWrite({ onAdd }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    category: '기타',
    isSecret: false,
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요.';
    if (!formData.author.trim()) newErrors.author = '이름을 입력해주세요.';
    if (!formData.content.trim()) newErrors.content = '상세 질문 내용을 입력해주세요.';
    if (formData.isSecret && (!formData.password || formData.password.length !== 4)) {
      newErrors.password = '비밀글 설정을 위해 숫자 4자리 비밀번호를 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd(formData);
    alert('질문이 성공적으로 등록되었습니다.');
    navigate('/qna');
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 24px', maxWidth: '750px' }}>
      <button onClick={() => navigate('/qna')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-600)', fontWeight: '600', marginBottom: '20px' }}>
        <ArrowLeft size={16} /> 목록으로 돌아가기
      </button>

      <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '36px', border: '1px solid rgba(60, 42, 33, 0.08)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '18px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--bg-coffee)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>❓</span> 1:1 질문 등록
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category & Writer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <SelectField
              label="문의 유형"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              options={[
                { value: '성분문의', label: '성분 및 칼로리 문의' },
                { value: '단체주문', label: '단체 주문 문의' },
                { value: '배송문의', label: '배송 / 퀵 서비스 문의' },
                { value: '클래스', label: '클래스 예약 문의' },
                { value: '기타', label: '기타 매장 문의' }
              ]}
            />
            <InputField
              label="작성자 이름"
              placeholder="실명을 입력하세요"
              value={formData.author}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, author: e.target.value }));
                if (errors.author) setErrors(prev => ({ ...prev, author: null }));
              }}
              error={errors.author}
            />
          </div>

          {/* Secret Post Option */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', padding: '14px', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
              <input
                type="checkbox"
                checked={formData.isSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, isSecret: e.target.checked }))}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-gold)' }}
              />
              비밀글로 등록하기
            </label>

            {formData.isSecret && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>비밀번호 (숫자 4자리):</label>
                <input
                  type="password"
                  placeholder="비밀번호"
                  maxLength={4}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value.replace(/[^0-9]/g, '') }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  style={{ width: '100px', padding: '8px', border: errors.password ? '1.5px solid var(--accent-rust)' : '1px solid var(--gray-300)', borderRadius: 'var(--radius-sm)', textAlign: 'center', letterSpacing: '2px', outline: 'none' }}
                />
              </div>
            )}
            {errors.password && <div style={{ color: 'var(--accent-rust)', fontSize: '12px', width: '100%' }}>{errors.password}</div>}
          </div>

          {/* Subject */}
          <InputField
            label="질문 제목"
            placeholder="문의 내용을 요약하여 작성해 주세요"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors(prev => ({ ...prev, title: null }));
            }}
            error={errors.title}
          />

          {/* Content */}
          <TextAreaField
            label="상세 질문 내용"
            placeholder="상세 내용을 설명해 주세요. 성분 문의인 경우 해당 품목 명을, 단체 문의인 경우 필요한 수량과 날짜를 기입해 주시면 정확한 답변에 도움이 됩니다."
            value={formData.content}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, content: e.target.value }));
              if (errors.content) setErrors(prev => ({ ...prev, content: null }));
            }}
            error={errors.content}
          />

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--gray-100)', paddingTop: '20px' }}>
            <Button variant="outline" onClick={() => navigate('/qna')}>취소</Button>
            <Button variant="primary" type="submit" icon={<Send size={14} />}>질문 등록하기</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QnaBoard;
export { QnaList, QnaDetail, QnaWrite };
