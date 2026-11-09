import React from 'react';
import { 
  Camera, BrainCircuit, MapPin, CheckCircle2, 
  ArrowRight, ShieldCheck, Activity, Zap, LayoutDashboard, Copy, HardHat, FileText
} from 'lucide-react';
import Logo from './Logo';

export default function LandingHomePage({ onGetStarted, onAuthorityLogin, onViewMap, onNavigate, isAuthenticated, currentUser, onLogout }) {
  return (
    <div style={{ background: '#0a0a0a', color: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Landing Navbar */}
      <nav style={{ position: 'fixed', width: '100%', zIndex: 50, top: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="landing-nav-container">
          {/* Logo */}
          <Logo size="medium" onClick={() => onNavigate('home')} />

          {/* Desktop Nav Items */}
          <div className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => onNavigate('reporter')} 
              style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Camera size={16} /> Report Issue
            </button>
            <button 
              onClick={() => onNavigate('duplicates')} 
              style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Copy size={16} /> Duplicate Intelligence
            </button>
            <button 
              onClick={() => onNavigate('admin')} 
              style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LayoutDashboard size={16} /> Admin Dashboard
            </button>
            <button 
              onClick={() => onNavigate('worker')} 
              style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <HardHat size={16} /> Worker Queue
            </button>
          </div>

          {/* User Status or Authority Login Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAuthenticated && currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'rgba(255,255,255,0.06)', 
                  border: '1px solid rgba(255,255,255,0.12)', 
                  padding: '6px 12px', 
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {currentUser.role === 'worker' ? (
                    <HardHat size={14} style={{ color: '#38bdf8' }} />
                  ) : (
                    <User size={14} style={{ color: 'var(--accent-color)' }} />
                  )}
                  <span style={{ fontWeight: '600', color: '#fff' }}>{currentUser.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  style={{ 
                    background: 'none', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    color: '#94a3b8', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    cursor: 'pointer' 
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onAuthorityLogin}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '24px', fontSize: '13px' }}
              >
                <ShieldCheck size={15} /> Authority Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero-section">
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '25%', left: '20%', width: '320px', height: '320px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '20%', width: '320px', height: '320px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
          <div className="hero-grid">
            
            {/* Hero Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content', color: 'var(--accent-color)', fontSize: '12px', fontWeight: '600' }}>
                <Zap size={14} /> AI-Powered Civic Infrastructure Platform
              </div>

              <h1 className="hero-title">
                Empowering Citizens, <br />
                <span style={{ background: 'linear-gradient(90deg, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Building Better Cities.
                </span>
              </h1>

              <p className="hero-subtitle">
                MAATRAM uses Computer Vision & Forensic AI to detect civic hazards, verify authentic camera captures, eliminate duplicates, and generate statutory government resolution orders.
              </p>

              {/* Action Buttons */}
              <div className="hero-buttons">
                <button 
                  onClick={onGetStarted}
                  className="btn-primary"
                  style={{ borderRadius: '30px', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)' }}
                >
                  <Camera size={18} /> Report an Issue <ArrowRight size={18} />
                </button>

                <button 
                  onClick={onViewMap}
                  className="btn-secondary"
                  style={{ borderRadius: '30px', fontSize: '15px', fontWeight: '600', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  <MapPin size={18} /> View Live Map
                </button>
              </div>

              {/* Quick Mobile Action Shortcuts (Phone Friendly) */}
              <div style={{ 
                marginTop: '10px',
                padding: '14px', 
                borderRadius: '16px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px'
              }}>
                <div 
                  onClick={() => onNavigate('reporter')}
                  style={{ padding: '10px', borderRadius: '10px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', cursor: 'pointer', textAlign: 'center' }}
                >
                  <Camera size={18} style={{ color: 'var(--accent-color)', margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Report Issue</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Camera Capture</div>
                </div>

                <div 
                  onClick={() => onNavigate('duplicates')}
                  style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}
                >
                  <Copy size={18} style={{ color: '#38bdf8', margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>AI Forensics</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Real vs AI Scan</div>
                </div>

                <div 
                  onClick={() => onNavigate('admin')}
                  style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}
                >
                  <LayoutDashboard size={18} style={{ color: '#10b981', margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Live Dashboard</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>City Analytics</div>
                </div>
              </div>

            </div>

            {/* Hero Right Scanner Preview Mock */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.12)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#eab308' }} />
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: '700' }}>AI_SCANNER_LIVE</span>
                </div>

                <div style={{ position: 'relative', height: '200px', background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800" 
                    alt="Road issue scan"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
                  />

                  {/* Detection Bounding Box */}
                  <div style={{ position: 'absolute', top: '22%', left: '22%', width: '120px', height: '110px', border: '2px solid var(--accent-color)', background: 'rgba(249, 115, 22, 0.2)', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'flex-start', boxShadow: '0 0 15px rgba(249, 115, 22, 0.5)' }}>
                    <span style={{ background: 'var(--accent-color)', color: '#000', fontSize: '9px', fontWeight: '800', padding: '2px 5px', borderRadius: '2px' }}>
                      Pothole 98%
                    </span>
                  </div>

                  {/* Laser Scan Bar */}
                  <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: 'var(--accent-color)', boxShadow: '0 0 12px var(--accent-color)' }} />
                </div>

                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Forensic Verification:</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>Real Camera (96%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Statutory Docket:</span>
                    <span style={{ color: '#38bdf8', fontWeight: '600' }}>48h SLA Order</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="landing-section-padding" style={{ background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            <h2 className="landing-section-title">
              How <span style={{ color: 'var(--accent-color)' }}>MAATRAM</span> Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
              From a citizen's mobile camera photo to verified government resolution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { title: "1. Snap a Photo", desc: "Citizen takes a photo with their mobile camera. Location GPS coordinates are attached automatically.", icon: Camera },
              { title: "2. Forensic AI Check", desc: "Our engine verifies genuine camera capture, weeds out fake AI images, and checks for 50m duplicates.", icon: BrainCircuit },
              { title: "3. Government Docket", desc: "Generates an official statutory grievance docket with Section 133 CrPC 48-hour SLA directive.", icon: FileText },
              { title: "4. Worker Resolution", desc: "Field workers execute repair and upload proof. AI verifies the fix and alerts citizens automatically.", icon: CheckCircle2 }
            ].map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: 'var(--accent-color)' }}>
                  <step.icon size={24} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 8px 0', color: '#fff' }}>{step.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Stats */}
      <section id="impact" className="landing-section-padding">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          <div className="landing-impact-box">
            <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 32px 0', color: '#fff' }}>Real-Time Community Impact</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircle2 size={28} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
                <div className="impact-stat-val">1,200+</div>
                <div style={{ color: 'var(--accent-color)', fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.8px', marginTop: '4px' }}>Issues Resolved</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Activity size={28} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
                <div className="impact-stat-val">97.8%</div>
                <div style={{ color: 'var(--accent-color)', fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.8px', marginTop: '4px' }}>AI Detection Accuracy</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Zap size={28} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
                <div className="impact-stat-val">24h</div>
                <div style={{ color: 'var(--accent-color)', fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.8px', marginTop: '4px' }}>Avg. Field SLA Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '30px 0 60px 0', background: '#050505', fontSize: '13px', color: '#64748b' }}>
        <div className="landing-footer-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <Logo size="medium" onClick={() => onNavigate('home')} />

          <div>© {new Date().getFullYear()} MAATRAM Smart Resolution Platform. All rights reserved.</div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => onNavigate('reporter')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>Citizen App</button>
            {isAuthenticated ? (
              <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Sign Out ({currentUser?.name})</button>
            ) : (
              <button onClick={onAuthorityLogin} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Authority Portal</button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
