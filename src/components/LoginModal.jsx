import React, { useState } from 'react';
import { User, HardHat, Shield, Lock, Mail, ArrowRight, CheckCircle, AlertCircle, Building2 } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'worker'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          role: activeTab === 'citizen' ? 'citizen' : 'worker'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Welcome back, ${data.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 800);
      } else {
        setErrorMessage(data.error || 'Authentication failed.');
      }
    } catch (error) {
      console.error('Login request failed:', error);
      // Fallback for offline prototype demo logins
      if ((activeTab === 'citizen' && email === 'user@civic.com') || (activeTab === 'worker' && email === 'worker@civic.com')) {
        const mockUser = activeTab === 'citizen' 
          ? { name: 'Citizen User', email: 'user@civic.com', role: 'citizen' }
          : { name: 'Field Worker', email: 'worker@civic.com', role: 'worker', department: 'Public Works' };
        
        setSuccessMessage(`Logged in as ${mockUser.name}`);
        setTimeout(() => {
          onLoginSuccess(mockUser);
          onClose();
        }, 800);
      } else {
        setErrorMessage('Invalid credentials. Demo logins: user@civic.com / user123 or worker@civic.com / worker123');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'citizen') {
      setActiveTab('citizen');
      setEmail('user@civic.com');
      setPassword('user123');
    } else {
      setActiveTab('worker');
      setEmail('worker@civic.com');
      setPassword('worker123');
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 12, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          position: 'relative',
          borderRadius: '24px'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '16px', 
              background: 'var(--accent-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 12px auto',
              color: 'white'
            }}
          >
            <Shield size={26} />
          </div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700' }}>Civic Mana Portal Login</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
            Connected to SQLite Authentication Database
          </p>
        </div>

        {/* User Role Selector Tabs */}
        <div 
          style={{
            display: 'flex',
            gap: '8px',
            background: 'var(--bg-color)',
            padding: '6px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            type="button"
            onClick={() => { setActiveTab('citizen'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'citizen' ? 'var(--accent-color)' : 'transparent',
              color: activeTab === 'citizen' ? 'white' : 'var(--text-main)',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <User size={16} /> Citizen User
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('worker'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'worker' ? '#0284c7' : 'transparent',
              color: activeTab === 'worker' ? 'white' : 'var(--text-main)',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <HardHat size={16} /> Field Worker
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {activeTab === 'citizen' ? 'Citizen Email Address' : 'Worker Official Email'}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder={activeTab === 'citizen' ? 'user@civic.com' : 'worker@civic.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: '10px',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: '10px',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {errorMessage && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} />
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'citizen' ? 'var(--accent-color)' : '#0284c7',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? 'Authenticating with SQLite...' : (
              <>
                Login to {activeTab === 'citizen' ? 'Citizen Portal' : 'Worker App'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Autofill Helpers */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Demo Credentials:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => handleQuickDemo('citizen')}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
            >
              Autofill Citizen
            </button>
            <button 
              onClick={() => handleQuickDemo('worker')}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
            >
              Autofill Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
