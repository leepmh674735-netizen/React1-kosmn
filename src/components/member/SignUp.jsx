import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus, CheckCircle2, User, Mail, Lock, Sparkles, Award, Camera } from 'lucide-react';
import Button from '../common/Button';
import InputField from '../common/InputField';
import AuthLayout from './AuthLayout';

function SignUp({ onLogin }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1); // Step 1: Info & Profile Pic, Step 2: Preferences, Step 3: Success
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    favoriteBread: '시그니처 우유 식빵', 
    alertAllergy: false 
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: '이미지 파일만 업로드할 수 있습니다.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: '파일 크기는 최대 5MB까지 가능합니다.' }));
        return;
      }

      setProfileImage(file);
      setErrors(prev => ({ ...prev, profileImage: null }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
      if (!formData.email.trim()) newErrors.email = '이메일 주소를 입력해주세요.';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '이메일 형식이 바르지 않습니다.';
      if (!formData.password.trim()) newErrors.password = '비밀번호를 입력해주세요.';
      else if (formData.password.length < 4) newErrors.password = '비밀번호는 최소 4자 이상이어야 합니다.';

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      setStep(2);
    }
  };

  const handleSignUpComplete = async () => {
    setErrors(prev => ({ ...prev, submit: null }));
    setSubmitting(true);

    const submitData = new FormData();
    submitData.append('username', formData.email);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('passwordCheck', formData.password);
    submitData.append('name', formData.name);

    if (profileImage) {
      submitData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('http://localhost:8080/member/join', {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '회원가입에 실패했습니다.');
      }

      const result = await response.json();
      console.log('SignUp Successful:', result);

      onLogin(formData.name, formData.email);
      setStep(3);
    } catch (err) {
      console.error('SignUp Error:', err);
      setErrors(prev => ({ ...prev, submit: err.message || '서버 통신 오류가 발생했습니다.' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title={step === 3 ? "가입 완료!" : "아틀리에 회원가입"} 
      description={
        step === 1 ? "프로필 이미지와 기본 정보를 등록해주세요." :
        step === 2 ? "고객님께 딱 맞는 빵 추천을 제공하기 위한 맞춤 질문입니다." :
        "밀아틀리에 정식 회원이 되신 것을 진심으로 환영합니다!"
      }
    >
      {/* Step Indicators */}
      {step < 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: step >= 1 ? 'var(--primary-gold)' : 'var(--gray-200)' }}></span>
          <span style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: step >= 2 ? 'var(--primary-gold)' : 'var(--gray-200)' }}></span>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Circular Profile Image Picker */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div 
              onClick={handleImageClick}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-gold-light)',
                border: '2px dashed var(--primary-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'var(--transition-normal)',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="profile-picker-container"
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--secondary-brown)' }}>
                  <Camera size={24} />
                  <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: '700' }}>사진 등록</span>
                </div>
              )}
              {/* Overlay camera icon on hover */}
              {imagePreview && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(60, 42, 33, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    opacity: 0,
                    transition: 'var(--transition-fast)'
                  }}
                  className="profile-picker-overlay"
                >
                  <Camera size={20} />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <span style={{ fontSize: '11px', color: 'var(--gray-500)' }}>프로필 사진 (선택 사항)</span>
            {errors.profileImage && <span style={{ color: 'var(--accent-rust)', fontSize: '12px' }}>{errors.profileImage}</span>}
          </div>

          <InputField
            label="이름"
            type="text"
            placeholder="홍길동"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            icon={<User size={16} />}
          />

          <InputField
            label="이메일"
            type="email"
            placeholder="example@mail.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            icon={<Mail size={16} />}
          />

          <InputField
            label="비밀번호"
            type="password"
            placeholder="비밀번호 설정 (4자 이상)"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            error={errors.password}
            icon={<Lock size={16} />}
          />

          <Button variant="primary" type="submit" fullWidth icon={<ArrowRight size={16} />} style={{ marginTop: '10px' }}>
            다음 단계로
          </Button>
        </form>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--bg-coffee)' }}>가장 좋아하는 식빵 스타일</label>
            <select
              value={formData.favoriteBread}
              onChange={(e) => setFormData(prev => ({ ...prev, favoriteBread: e.target.value }))}
              style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-md)', outline: 'none', backgroundColor: 'var(--bg-milk)', color: 'var(--bg-coffee)', fontSize: '14px' }}
            >
              <option value="시그니처 우유 식빵">깃털처럼 촉촉한 시그니처 생(生) 밀크 식빵</option>
              <option value="고소한 트리플 치즈 식빵">짭조름하고 고소한 치즈 식빵</option>
              <option value="소화 편한 통밀/천연발효종">속이 편하고 구수한 통밀 / 발효종 건강 식빵</option>
              <option value="달콤한 초코/시나몬 식빵">오후의 간식으로 좋은 달콤 마블 식빵</option>
            </select>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'rgba(210, 93, 56, 0.05)', border: '1px dashed var(--accent-rust)', borderRadius: 'var(--radius-md)' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--bg-coffee)' }}>
              <input
                type="checkbox"
                checked={formData.alertAllergy}
                onChange={(e) => setFormData(prev => ({ ...prev, alertAllergy: e.target.checked }))}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-rust)', marginTop: '2px' }}
              />
              <div>
                알레르기 경고 알림 설정하기
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray-600)', fontWeight: '500', marginTop: '4px', lineHeight: '1.4' }}>
                  우유, 달걀, 밀, 호두 등 성분이 포함된 상품 상세 조회 시 알림 마크를 띄워 고객님의 안전한 브레드 쇼핑을 돕습니다.
                </span>
              </div>
            </label>
          </div>

          {/* 에러 메시지 표시 */}
          {errors.submit && (
            <div style={{ color: 'var(--accent-rust)', fontSize: '13px', fontWeight: '600', padding: '10px', backgroundColor: 'rgba(210, 93, 56, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-rust)', textAlign: 'center' }}>
              {errors.submit}
            </div>
          )}

          {/* Reusable, Mobile-First stacked buttons overriding to row layout on desktop */}
          <div className="signup-btn-group">
            <Button variant="outline" onClick={() => setStep(1)} disabled={submitting}>이전 단계</Button>
            <Button variant="primary" onClick={handleSignUpComplete} loading={submitting} icon={<UserPlus size={16} />}>회원가입 완료</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-gold-light)', color: 'var(--secondary-brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-gold-gradient" style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>가입을 축하합니다!</h3>
          <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: '1.6', marginBottom: '28px' }}>
            <strong>{formData.name}</strong> 고객님, 밀아틀리에 정식 회원이 되셨습니다.<br />
            환영 적립금 <strong>1,200 포인트</strong>가 지금 지급되었습니다.
          </p>
          <Button variant="primary" fullWidth icon={<Award size={16} />} onClick={() => navigate('/member/mypage')}>
            마이페이지로 이동
          </Button>
        </div>
      )}

      <style>{`
        /* Mobile-First Layout for buttons: Stack vertically by default */
        .signup-btn-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }
        
        .signup-btn-group button {
          width: 100%;
        }

        /* Hover animation for profile image picker */
        .profile-picker-container:hover {
          border-color: var(--primary-gold-hover) !important;
          transform: scale(1.03);
        }

        .profile-picker-container:hover .profile-picker-overlay {
          opacity: 1 !important;
        }

        /* Desktop Layout: Side-by-side row arrangement */
        @media (min-width: 480px) {
          .signup-btn-group {
            flex-direction: row;
            gap: 10px;
          }
          .signup-btn-group button {
            flex: 1;
            width: auto;
          }
        }
      `}</style>
    </AuthLayout>
  );
}

export default SignUp;
