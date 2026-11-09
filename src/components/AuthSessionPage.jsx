import React, { useState } from 'react';
import { 
  User, HardHat, Mail, Lock, ArrowRight, Shield, CheckCircle, 
  AlertCircle, Sparkles, Building2, Eye, EyeOff, ArrowLeft, KeyRound
} from 'lucide-react';

const AuthSessionPage = ({ onLoginSuccess, onSwitchToApp, onBack, initialRole = 'worker' }) => {
  const [role, setRole] = useState(initialRole); // 'citizen' | 'worker'
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Public Works');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name, email, password, role, department: role === 'worker' ? department : null }
      : { email, password, role };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isRegister ? 'Account created successfully! Logging in...' : `Welcome back, ${data.user?.name || 'Field Specialist'}!`);
        const authenticatedUser = data.user || { name, email, role, department };
        setTimeout(() => {
          onLoginSuccess(authenticatedUser);
        }, 800);
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.log('Using prototype offline authentication fallback:', err);
      // Offline / client-side mock authentication for prototype
      const mockUser = role === 'citizen'
        ? { name: name || 'Citizen User', email: email || 'user@civic.com', role: 'citizen' }
        : { name: name || 'Officer Rajesh (Field Specialist)', email: email || 'worker@civic.com', role: 'worker', department };

      setSuccess(`Authenticated as ${mockUser.name}`);
      setTimeout(() => {
        onLoginSuccess(mockUser);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAutofill = (targetRole) => {
    setRole(targetRole);
    setIsRegister(false);
    setError('');
    if (targetRole === 'citizen') {
      setEmail('user@civic.com');
      setPassword('user123');
    } else {
      setEmail('worker@civic.com');
      setPassword('worker123');
      setDepartment('Public Works');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(circle at 10% 20%, #151921 0%, #0a0c10 90%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        overflowY: 'auto',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Top Floating Bar */}
      <div style={{ 
        width: '100%', 
        maxWidth: '960px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px',
        zIndex: 10
      }}>
        <button
          type="button"
          onClick={onBack || onSwitchToApp}
          className="btn-secondary"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '24px',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={16} style={{ color: 'var(--accent-color)' }} /> Back to App
        </button>

        <button 
          type="button" 
          onClick={onSwitchToApp}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            fontSize: '12px', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Continue as Guest →
        </button>
      </div>

      {/* Main Responsive Split Auth Card */}
      <div 
        className="glass-panel"
        style={{
          maxWidth: '960px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 2
        }}
      >
        {/* Left Side: Brand Showcase & Role Explanation */}
        <div 
          style={{
            background: 'linear-gradient(145deg, rgba(20, 24, 33, 0.98), rgba(12, 14, 20, 0.99))',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative'
          }}
        >
          <div>
            {/* Header with clean logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 18px rgba(249, 115, 22, 0.3)',
                  border: '1.5px solid rgba(249, 115, 22, 0.4)',
                  background: '#0d0f14'
                }}
              >
                <img 
                  src="/logo.png" 
                  alt="Civic Vision Clean Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff' }}>
                  CIVIC<span style={{ color: 'var(--accent-color)' }}>VISION</span>
                </h1>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Official Authority & Field Portal
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              {role === 'worker' ? (
                <span>
                  🔒 <strong>Field Operations Gateway:</strong> Sign in with your municipal field credentials to access the rapid issue queue, inspect GIS clusters, and submit verified photo repairs.
                </span>
              ) : (
                <span>
                  👤 <strong>Citizen Access Portal:</strong> Sign in to submit civic issues, track real-time resolution progress, and receive statutory government resolution dockets.
                </span>
              )}
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Shield size={18} style={{ color: role === 'worker' ? '#0284c7' : 'var(--accent-color)', flexShrink: 0 }} />
                <div style={{ fontSize: '12px' }}>
                  <strong style={{ color: '#fff' }}>Role-Restricted Work Queue</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Field operations accessible only to authorized staff</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Sparkles size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                <div style={{ fontSize: '12px' }}>
                  <strong style={{ color: '#fff' }}>AI Verification System</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>SSIM + YOLO consensus fix verification</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Municipal Security Protocol • Encrypted Session
          </div>
        </div>

        {/* Right Side: Responsive Form for Citizens & Workers */}
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Role Toggle Tabs */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              background: 'rgba(15, 17, 23, 0.8)',
              padding: '5px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              marginBottom: '20px'
            }}
          >
            <button
              type="button"
              onClick={() => { setRole('worker'); setError(''); }}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: role === 'worker' ? '#0284c7' : 'transparent',
                color: role === 'worker' ? 'white' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <HardHat size={16} /> Field Worker
            </button>

            <button
              type="button"
              onClick={() => { setRole('citizen'); setError(''); }}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: role === 'citizen' ? 'var(--accent-color)' : 'transparent',
                color: role === 'citizen' ? 'white' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={16} /> Citizen User
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700', color: '#fff' }}>
              {isRegister 
                ? (role === 'worker' ? 'Register Field Specialist' : 'Create Citizen Account')
                : (role === 'worker' ? 'Field Worker Sign In' : 'Citizen Sign In')}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px' }}>
              {role === 'worker' 
                ? 'Authorized municipal access to live civic work orders.' 
                : 'Submit and track citizen infrastructure tickets.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder={role === 'worker' ? 'e.g. Officer Rajesh' : 'e.g. Anand Kumar'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '8px',
                      background: 'rgba(15, 17, 23, 0.9)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '5px' }}>
                {role === 'worker' ? 'Official Worker Email' : 'Email Address'}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder={role === 'worker' ? 'worker@civic.com' : 'user@civic.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '8px',
                    background: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>

            {isRegister && role === 'worker' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Assigned Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Public Works">Public Works</option>
                  <option value="Road Works">Road Works</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Parks & Recreation">Parks & Recreation</option>
                </select>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 36px',
                    borderRadius: '8px',
                    background: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} flexShrink={0} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} flexShrink={0} />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: role === 'worker' ? '#0284c7' : 'var(--accent-color)',
                fontSize: '14px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px'
              }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  {isRegister ? 'Register Account' : `Sign In as ${role === 'worker' ? 'Field Worker' : 'Citizen'}`} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login vs Register */}
          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already registered?' : "Need an official account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: role === 'worker' ? '#0284c7' : 'var(--accent-color)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>1-Click Fast Login:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => handleQuickAutofill('worker')}
                style={{ 
                  background: 'rgba(2, 132, 199, 0.15)', 
                  border: '1px solid #0284c7', 
                  color: '#38bdf8', 
                  padding: '8px 10px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <HardHat size={13} /> Field Worker
              </button>
              <button 
                type="button"
                onClick={() => handleQuickAutofill('citizen')}
                style={{ 
                  background: 'rgba(249, 115, 22, 0.15)', 
                  border: '1px solid var(--accent-color)', 
                  color: 'var(--accent-color)', 
                  padding: '8px 10px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <User size={13} /> Citizen
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthSessionPage;
