import React, { useState } from 'react';
import { User, HardHat, Mail, Lock, ArrowRight, Shield, CheckCircle, AlertCircle, Sparkles, Building2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const AuthSessionPage = ({ onLoginSuccess, onSwitchToApp, onBack }) => {
  const [role, setRole] = useState('citizen'); // 'citizen' | 'worker'
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
        setSuccess(isRegister ? 'Account created successfully! Logging in...' : `Welcome back, ${data.user.name}!`);
        const authenticatedUser = data.user || { name, email, role, department };
        setTimeout(() => {
          onLoginSuccess(authenticatedUser);
        }, 1000);
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Auth request error:', err);
      // Fallback for prototype session offline fallback
      const mockUser = role === 'citizen'
        ? { name: name || 'Citizen User', email: email || 'user@civic.com', role: 'citizen' }
        : { name: name || 'Field Specialist', email: email || 'worker@civic.com', role: 'worker', department };

      setSuccess(`Authenticated as ${mockUser.name}`);
      setTimeout(() => {
        onLoginSuccess(mockUser);
      }, 1000);
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
        width: '100vw',
        background: 'radial-gradient(circle at 10% 20%, #151921 0%, #0a0c10 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflowY: 'auto',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Background Animated Subtle Mesh Overlay */}
      <button
        type="button"
        onClick={onBack || onSwitchToApp}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '30px',
          fontWeight: '600',
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowLeft size={16} style={{ color: 'var(--accent-color)' }} /> Back to Application
      </button>
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            radial-gradient(rgba(249, 115, 22, 0.08) 1px, transparent 1px), 
            radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
          pointerEvents: 'none',
          opacity: 0.8
        }}
      />

      {/* Main Split Authentication Card */}
      <div 
        className="glass-panel"
        style={{
          maxWidth: '1020px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 2
        }}
      >
        {/* Left Side: Brand Showcase & Textured Clean Logo */}
        <div 
          style={{
            background: 'linear-gradient(145deg, rgba(20, 24, 33, 0.95), rgba(12, 14, 20, 0.98))',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div 
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />

          <div>
            {/* Clean Textured Logo Display (Watermark Free) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
                  border: '2px solid rgba(249, 115, 22, 0.4)',
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
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff' }}>
                  CIVIC<span style={{ color: 'var(--accent-color)' }}>VISION</span>
                </h1>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Smart Civic Resolution Platform
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: '0 0 28px 0' }}>
              Empowering citizens with AI visual verification & providing field operations with geospatial intelligence connected directly to an encrypted SQLite database.
            </p>

            {/* Feature Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Sparkles size={20} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                <div style={{ fontSize: '13px' }}>
                  <strong style={{ color: '#fff' }}>AI Proof Verification</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>SSIM + YOLOv8 fraud prevention engine</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Building2 size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <div style={{ fontSize: '13px' }}>
                  <strong style={{ color: '#fff' }}>Geospatial GIS Pipeline</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Thanjavur jurisdiction cluster analysis</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Shield size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                <div style={{ fontSize: '13px' }}>
                  <strong style={{ color: '#fff' }}>SQLite Auth Security</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Role-based Citizen & Worker access</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Civic Vision v2.4 • SQLite Connected</span>
            <button 
              type="button" 
              onClick={onSwitchToApp}
              style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
            >
              Enter as Guest →
            </button>
          </div>
        </div>

        {/* Right Side: Responsive Form for Citizens & Workers */}
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Role Toggle Tabs (Citizen vs Worker) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              background: 'rgba(15, 17, 23, 0.8)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              marginBottom: '24px'
            }}
          >
            <button
              type="button"
              onClick={() => { setRole('citizen'); setError(''); }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: role === 'citizen' ? 'var(--accent-color)' : 'transparent',
                color: role === 'citizen' ? 'white' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <User size={18} /> Citizen Portal
            </button>

            <button
              type="button"
              onClick={() => { setRole('worker'); setError(''); }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: role === 'worker' ? '#0284c7' : 'transparent',
                color: role === 'worker' ? 'white' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <HardHat size={18} /> Field Worker
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700' }}>
              {isRegister 
                ? (role === 'citizen' ? 'Create Citizen Account' : 'Register Field Specialist')
                : (role === 'citizen' ? 'Citizen Sign In' : 'Field Operations Sign In')}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
              {role === 'citizen' 
                ? 'Report issues, track tickets, and receive real-time resolution alerts.' 
                : 'Access assigned municipal work orders and upload AI fix proofs.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder={role === 'citizen' ? 'e.g. Anand Kumar' : 'e.g. Officer Rajesh'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '10px',
                      background: 'rgba(15, 17, 23, 0.9)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {role === 'citizen' ? 'Citizen Email Address' : 'Field Worker Official Email'}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder={role === 'citizen' ? 'user@civic.com' : 'worker@civic.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    background: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {isRegister && role === 'worker' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Assigned Municipal Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Road Works">Road Works</option>
                  <option value="Public Works">Public Works</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Parks & Recreation">Parks & Recreation</option>
                </select>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    borderRadius: '10px',
                    background: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: role === 'citizen' ? 'var(--accent-color)' : '#0284c7',
                color: 'white',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: role === 'citizen' ? '0 8px 20px rgba(249, 115, 22, 0.3)' : '0 8px 20px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Processing SQLite Session...' : (
                <>
                  {isRegister ? 'Complete Registration' : `Sign In to ${role === 'citizen' ? 'Citizen App' : 'Field Queue'}`} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login vs Register */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: role === 'citizen' ? 'var(--accent-color)' : '#0284c7', fontWeight: '700', cursor: 'pointer', padding: 0 }}
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Demo SQLite Fill:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => handleQuickAutofill('citizen')}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
              >
                Autofill Citizen
              </button>
              <button 
                type="button"
                onClick={() => handleQuickAutofill('worker')}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
              >
                Autofill Worker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSessionPage;
