import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import Button from '../common/Button';
import InputField from '../common/InputField';
import AuthLayout from './AuthLayout';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = '이메일 주소를 입력해 주세요.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';
    if (!password.trim()) newErrors.password = '비밀번호를 입력해 주세요.';
    else if (password.length < 4) newErrors.password = '비밀번호는 4자 이상이어야 합니다.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // Simulate login server delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate name extraction from email
    const name = email.split('@')[0];
    onLogin(name, email);
    setLoading(false);
    alert(`${name}님, 밀아틀리에에 오신 것을 환영합니다!`);
    navigate('/member/mypage');
  };

  return (
    <AuthLayout 
      title="밀아틀리에 로그인" 
      description="더 많은 혜택과 예약을 위해 로그인해 주세요."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <InputField
          label="이메일 계정"
          type="email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => { 
            setEmail(e.target.value); 
            if(errors.email) setErrors(prev => ({...prev, email: null})); 
          }}
          error={errors.email}
          icon={<Mail size={16} />}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--bg-coffee)' }}>비밀번호</label>
            <a href="#" style={{ fontSize: '11px', color: 'var(--primary-gold)', fontWeight: '700', textDecoration: 'none' }}>
              비밀번호 분실?
            </a>
          </div>
          <InputField
            type="password"
            placeholder="비밀번호를 입력하세요 (4자 이상)"
            value={password}
            onChange={(e) => { 
              setPassword(e.target.value); 
              if(errors.password) setErrors(prev => ({...prev, password: null})); 
            }}
            error={errors.password}
            icon={<Lock size={16} />}
          />
        </div>

        <Button 
          variant="primary" 
          type="submit" 
          fullWidth 
          loading={loading} 
          icon={<LogIn size={16} />}
          style={{ marginTop: '10px' }}
        >
          로그인하기
        </Button>

        <div className="login-divider-container">
          <span className="login-divider-text">아직 아틀리에 회원이 아니신가요?</span>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => navigate('/member/signup')}
            icon={<UserPlus size={16} />}
          >
            회원가입하기
          </Button>
        </div>
      </form>

      <style>{`
        .login-divider-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-top: 1px solid var(--gray-100);
          padding-top: 20px;
          margin-top: 8px;
          width: 100%;
        }
        
        .login-divider-text {
          fontSize: 13px;
          color: var(--gray-600);
        }
      `}</style>
    </AuthLayout>
  );
}

export default Login;
