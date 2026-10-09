import React from 'react';
import { 
  Camera, BrainCircuit, MapPin, CheckCircle2, 
  ArrowRight, ShieldCheck, Activity, Zap, Menu, LayoutDashboard, Copy, HardHat
} from 'lucide-react';
import Logo from './Logo';

export default function LandingHomePage({ onGetStarted, onAuthorityLogin, onViewMap, onNavigate }) {
  return (
    <div style={{ background: '#0a0a0a', color: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Landing Navbar */}
      <nav style={{ position: 'fixed', width: '100%', zIndex: 50, top: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
            
            {/* Logo */}
            <Logo size="medium" onClick={() => onNavigate('home')} />

            {/* Nav Items */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button 
                onClick={() => onNavigate('reporter')} 
                style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Camera size={16} /> Report Issue
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

            {/* Authority Login Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={onAuthorityLogin}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', fontSize: '14px' }}
              >
                <ShieldCheck size={16} /> Authority Login
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '140px', paddingBottom: '100px', overflow: 'hidden' }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '380px', height: '380px', background: 'rgba(249, 115, 22, 0.12)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '380px', height: '380px', background: 'rgba(59, 130, 246, 0.12)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
            {/* Hero Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content', color: 'var(--accent-color)', fontSize: '13px', fontWeight: '600' }}>
                <Zap size={14} /> Powered by Computer Vision AI & OpenCV
              </div>

              <h1 style={{ fontSize: '52px', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-1px', margin: 0 }}>
                Empowering Citizens, <br />
                <span style={{ background: 'linear-gradient(90deg, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Building Better Cities.
                </span>
              </h1>

              <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.6', margin: 0, maxWidth: '580px' }}>
                MAATRAM uses advanced AI to instantly detect, route, and track civic issues from a single photo. Report potholes, hazards, and infrastructure damage in seconds.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
                <button 
                  onClick={onGetStarted}
                  className="btn-primary"
                  style={{ padding: '16px 32px', borderRadius: '30px', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 25px rgba(249, 115, 22, 0.4)' }}
                >
                  Report an Issue <ArrowRight size={20} />
                </button>

                <button 
                  onClick={onViewMap}
                  className="btn-secondary"
                  style={{ padding: '16px 32px', borderRadius: '30px', fontSize: '16px', fontWeight: '600', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  View Live Map
                </button>
              </div>
            </div>

            {/* Hero Right Scanner Preview Mock */}
            <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.12)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: '600' }}>AI_SCAN_ACTIVE</span>
                </div>

                <div style={{ position: 'relative', height: '240px', background: '#111', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800" 
                    alt="Road issue scan"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
                  />

                  {/* YOLO Bounding Box */}
                  <div style={{ position: 'absolute', top: '25%', left: '25%', width: '130px', height: '130px', border: '2px solid var(--accent-color)', background: 'rgba(249, 115, 22, 0.2)', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'flex-start', boxShadow: '0 0 15px rgba(249, 115, 22, 0.5)' }}>
                    <span style={{ background: 'var(--accent-color)', color: '#000', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '2px' }}>
                      Pothole 98%
                    </span>
                  </div>

                  {/* Laser Scan Bar */}
                  <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: 'var(--accent-color)', boxShadow: '0 0 12px var(--accent-color)' }} />
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Severity Evaluation:</span>
                    <span style={{ color: '#ef4444', fontWeight: '700' }}>High Priority</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Auto-Routed to:</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>Road Works Dept</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" style={{ padding: '90px 0', background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 16px 0' }}>
              How <span style={{ color: 'var(--accent-color)' }}>MAATRAM</span> Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '17px', margin: 0 }}>
              A seamless, automated pipeline from a citizen's camera to a verified, resolved city issue.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { title: "1. Snap a Photo", desc: "See an issue? Take a picture of the problem and let the app fetch your GPS coordinates.", icon: Camera },
              { title: "2. AI Detection", desc: "Our YOLO/OpenCV engine instantly identifies the issue type and computes a priority score.", icon: BrainCircuit },
              { title: "3. Smart Routing", desc: "Using spatial GIS clustering, duplicates are merged and routed to municipal field teams.", icon: MapPin },
              { title: "4. AI Resolution", desc: "Field workers upload proof photo. AI verifies resolution and alerts citizens automatically.", icon: CheckCircle2 }
            ].map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '32px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(249, 115, 22, 0.12)', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '20px', color: 'var(--accent-color)' }}>
                  <step.icon size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#fff' }}>{step.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Stats */}
      <section id="impact" style={{ padding: '90px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="glass-panel" style={{ padding: '56px 32px', borderRadius: '32px', background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(255,255,255,0.02))', border: '1px solid rgba(249, 115, 22, 0.2)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 48px 0', color: '#fff' }}>Real-Time Community Impact</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--accent-color)', marginBottom: '12px' }} />
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>1,200+</div>
                <div style={{ color: 'var(--accent-color)', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginTop: '4px' }}>Issues Resolved</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Activity size={32} style={{ color: 'var(--accent-color)', marginBottom: '12px' }} />
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>94%</div>
                <div style={{ color: 'var(--accent-color)', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginTop: '4px' }}>AI Detection Precision</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Zap size={32} style={{ color: 'var(--accent-color)', marginBottom: '12px' }} />
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>24h</div>
                <div style={{ color: 'var(--accent-color)', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px', marginTop: '4px' }}>Avg. Field SLA Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '40px 0', background: '#050505', fontSize: '14px', color: '#64748b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <Logo size="medium" onClick={() => onNavigate('home')} />

          <div>© {new Date().getFullYear()} MAATRAM Smart Resolution Platform. All rights reserved.</div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => onNavigate('reporter')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Citizen App</button>
            <button onClick={onAuthorityLogin} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: '600', cursor: 'pointer' }}>Authority Portal</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
