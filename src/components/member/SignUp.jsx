import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus, CheckCircle2, User, Mail, Lock, Sparkles, Award } from 'lucide-react';
import Button from '../common/Button';
import InputField from '../common/InputField';
import AuthLayout from './AuthLayout';

function SignUp({ onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Info, Step 2: Preferences, Step 3: Success
  const [formData, setFormData] = useState({ name: '', email: '', password: '', favoriteBread: '시그니처 우유 식빵', alertAllergy: false });
  const [errors, setErrors] = useState({});

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

  const handleSignUpComplete = () => {
    onLogin(formData.name, formData.email);
    setStep(3);
  };

  return (
    <AuthLayout 
      title={step === 3 ? "가입 완료!" : "아틀리에 회원가입"} 
      description={
        step === 1 ? "기본 계정 정보를 등록해주세요." :
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

          {/* Reusable, Mobile-First stacked buttons overriding to row layout on desktop */}
          <div className="signup-btn-group">
            <Button variant="outline" onClick={() => setStep(1)}>이전 단계</Button>
            <Button variant="primary" onClick={handleSignUpComplete} icon={<UserPlus size={16} />}>회원가입 완료</Button>
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
