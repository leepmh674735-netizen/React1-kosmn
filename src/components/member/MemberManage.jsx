import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import MyPage from './MyPage';

// Shared global state simulation for user authentication
let SIMULATED_USER = {
  isLoggedIn: false,
  name: '',
  email: '',
  level: '실버 멤버',
  points: 1200,
  joinedAt: '2026-05-28'
};

function MemberManage() {
  const [currentUser, setCurrentUser] = useState(SIMULATED_USER);

  const handleLogin = (name, email) => {
    const newUser = {
      isLoggedIn: true,
      name,
      email,
      level: '골든 르뱅 (VIP)',
      points: 5400,
      joinedAt: '2026-01-15'
    };
    SIMULATED_USER = newUser;
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    const defaultUser = {
      isLoggedIn: false,
      name: '',
      email: '',
      level: '실버 멤버',
      points: 0,
      joinedAt: ''
    };
    SIMULATED_USER = defaultUser;
    setCurrentUser(defaultUser);
  };

  return (
    <Routes>
      {/* Route mapping for member dashboard, login, and registration */}
      <Route 
        path="/" 
        element={currentUser.isLoggedIn ? <MyPage user={currentUser} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} 
      />
      <Route 
        path="/login" 
        element={<Login onLogin={handleLogin} />} 
      />
      <Route 
        path="/signup" 
        element={<SignUp onLogin={handleLogin} />} 
      />
      <Route 
        path="/register" 
        element={<SignUp onLogin={handleLogin} />} 
      />
      <Route 
        path="/mypage" 
        element={<MyPage user={currentUser} onLogout={handleLogout} />} 
      />
    </Routes>
  );
}

export default MemberManage;
export { SIMULATED_USER };
