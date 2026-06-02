import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import SectionHeader from '../common/SectionHeader';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import TextAreaField from '../common/TextAreaField';

function NoticeWrite() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '아틀리에 매니저',
    content: '',
    category: '일반', // '일반', '이벤트', '중요'
    isPinned: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '공지사항 제목을 입력해주세요.';
    } else if (formData.title.length < 5) {
      newErrors.title = '제목은 최소 5자 이상이어야 합니다.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '공지사항 내용을 입력해주세요.';
    } else if (formData.content.length < 10) {
      newErrors.content = '내용은 최소 10자 이상 작성해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate backend API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock save to localStorage or backend URL (in real backend: POST to http://localhost:8080/notice/write)
      console.log('Submitted notice data:', formData);
      
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate('/notice');
    } catch (err) {
      console.error(err);
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styling
  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
    width: '100%'
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-milk)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    border: '1px solid rgba(60, 42, 33, 0.08)',
    boxShadow: 'var(--shadow-md)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    borderBottom: '1px solid var(--gray-200)',
    paddingBottom: '20px'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--bg-coffee)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--bg-coffee)'
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: hasError ? '1.5px solid var(--accent-rust)' : '1px solid var(--gray-300)',
    backgroundColor: '#ffffff',
    fontSize: '15px',
    color: 'var(--bg-coffee)',
    outline: 'none',
    transition: 'var(--transition-fast)',
    boxShadow: hasError ? '0 0 0 3px rgba(210, 93, 56, 0.15)' : 'none'
  });

  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--gray-300)',
    backgroundColor: '#ffffff',
    fontSize: '15px',
    color: 'var(--bg-coffee)',
    outline: 'none',
    cursor: 'pointer'
  };

  const textareaStyle = (hasError) => ({
    width: '100%',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    border: hasError ? '1.5px solid var(--accent-rust)' : '1px solid var(--gray-300)',
    backgroundColor: '#ffffff',
    fontSize: '15px',
    color: 'var(--bg-coffee)',
    outline: 'none',
    minHeight: '250px',
    resize: 'vertical',
    lineHeight: '1.6',
    transition: 'var(--transition-fast)',
    boxShadow: hasError ? '0 0 0 3px rgba(210, 93, 56, 0.15)' : 'none'
  });

  const checkboxGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--bg-coffee)'
  };

  const errorTextStyle = {
    color: 'var(--accent-rust)',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '500'
  };

  const actionStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    borderTop: '1px solid var(--gray-200)',
    paddingTop: '24px',
    marginTop: '12px'
  };

  return (
    <div style={containerStyle} className="fade-in">
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

      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <span>📝</span>
            <span>공지사항 작성</span>
          </h2>
          <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
            새로운 소식을 고객들에게 공유하세요.
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <SelectField
              label="구분"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={[
                { value: '일반', label: '일반 공지' },
                { value: '이벤트', label: '이벤트 소식' },
                { value: '중요', label: '중요 안내' }
              ]}
            />
            
            <InputField
              label="작성자"
              name="author"
              value={formData.author}
              disabled
              onChange={handleChange}
            />
          </div>

          {/* Pin Post Checkbox */}
          <div style={{ marginBottom: '24px' }}>
            <label style={checkboxGroupStyle}>
              <input 
                type="checkbox" 
                name="isPinned" 
                checked={formData.isPinned} 
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-gold)' }}
              />
              게시판 상단에 고정하기 (중요 공지)
            </label>
          </div>

          {/* Title Input */}
          <InputField
            label="공지 제목"
            name="title"
            placeholder="공지사항 제목을 입력하세요 (예: [이벤트] 5월 가정의 달 기념 식빵 1+1 이벤트)"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            style={{ marginBottom: '24px' }}
          />

          {/* Content Textarea */}
          <TextAreaField
            label={`공지 내용 (${formData.content.length} 자)`}
            name="content"
            placeholder="내용을 구체적으로 입력해주세요. 행사 내용, 일자, 혜택 등을 자세히 설명하면 좋습니다."
            value={formData.content}
            onChange={handleChange}
            error={errors.content}
            style={{ marginBottom: '24px' }}
          />

          {/* Actions */}
          <div style={actionStyle}>
            <Button 
              variant="outline" 
              onClick={() => navigate('/notice')}
              icon={<X size={16} />}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              icon={<Save size={16} />}
              loading={isSubmitting}
            >
              등록하기
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .back-btn:hover {
          color: var(--primary-gold) !important;
          transform: translateX(-2px);
        }
        .form-input:focus, .form-textarea:focus {
          border-color: var(--primary-gold) !important;
          box-shadow: 0 0 0 3px rgba(217, 160, 91, 0.15) !important;
        }
      `}</style>
    </div>
  );
}

export default NoticeWrite;
export { NoticeWrite as NoticeWhite }; // Support alternate name
