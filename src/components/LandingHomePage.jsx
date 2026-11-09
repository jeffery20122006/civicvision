import React, { useState } from 'react';
import { 
  Camera, BrainCircuit, MapPin, CheckCircle2, ArrowRight, ShieldCheck, 
  Activity, Zap, LayoutDashboard, Copy, HardHat, FileText, Shield, 
  AlertTriangle, Clock, Layers, Users, Building2, Check, ExternalLink,
  Cpu, Eye, Search, Smartphone, Award
} from 'lucide-react';
import Logo from './Logo';
import IssueMap from './IssueMap';

export default function LandingHomePage({ 
  onGetStarted, 
  onAuthorityLogin, 
  onViewMap, 
  onNavigate, 
  isAuthenticated, 
  currentUser, 
  onLogout 
}) {
  // Interactive AI Detection Preview Scenario State
  const scenarios = {
    pothole: {
      name: 'Severe Pothole',
      category: 'Road Surface Hazard (Crater)',
      confidence: '98.4% YOLOv8n Precision',
      severity: 'Critical (Tier 1)',
      dept: 'Highways & Public Works Wing',
      location: '10.78694° N, 79.13782° E • Old Bus Stand',
      verification: 'Verified Real CMOS Sensor • 0 Duplicates (14m)',
      img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=900',
      box: { top: '22%', left: '24%', width: '48%', height: '44%' }
    },
    garbage: {
      name: 'Waste Dump',
      category: 'Overflowing Sanitation Bin',
      confidence: '96.2% YOLOv8n Precision',
      severity: 'High (Tier 2)',
      dept: 'Sanitation & Health Division',
      location: '10.79201° N, 79.14502° E • Palace Gate',
      verification: 'Verified Real CMOS Sensor • 0 Duplicates (8m)',
      img: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=900',
      box: { top: '20%', left: '22%', width: '56%', height: '52%' }
    },
    pipe: {
      name: 'Pipe Rupture',
      category: 'Water Main Drinking Line Burst',
      confidence: '97.1% YOLOv8n Precision',
      severity: 'Critical (Tier 1)',
      dept: 'Water Supply & Sewerage Board',
      location: '10.77805° N, 79.14008° E • Medical College Rd',
      verification: 'Verified Real CMOS Sensor • 0 Duplicates (22m)',
      img: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f1563?auto=format&fit=crop&q=80&w=900',
      box: { top: '24%', left: '20%', width: '52%', height: '48%' }
    },
    streetlight: {
      name: 'Streetlight',
      category: 'Damaged Electrical Post',
      confidence: '94.8% YOLOv8n Precision',
      severity: 'Medium (Tier 3)',
      dept: 'Electrical Engineering Wing',
      location: '10.78912° N, 79.13450° E • Karanthai Sector',
      verification: 'Verified Real CMOS Sensor • 0 Duplicates',
      img: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=80&w=900',
      box: { top: '16%', left: '32%', width: '38%', height: '54%' }
    }
  };

  const [activeScenarioKey, setActiveScenarioKey] = useState('pothole');
  const [showBbox, setShowBbox] = useState(true);
  const currentScenario = scenarios[activeScenarioKey];

  return (
    <div className="civic-landing-wrapper">
      
      {/* 1. TOP INSTITUTIONAL NAVIGATION */}
      <nav className="civic-nav">
        <div className="civic-nav-inner">
          {/* Logo & Civic Tech Designation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo size="medium" onClick={() => onNavigate('home')} />
            <span style={{ 
              height: '18px', 
              width: '1px', 
              background: 'rgba(255,255,255,0.15)',
              display: 'inline-block' 
            }} className="landing-nav-links" />
            <span style={{ 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              color: 'var(--civic-text-subtle)', 
              fontWeight: '700' 
            }} className="landing-nav-links">
              MUNICIPAL AI INTELLIGENCE
            </span>
          </div>

          {/* Desktop Central Navigation Links */}
          <div className="civic-nav-links">
            <button 
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="civic-nav-link"
            >
              How It Works
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('ai-capabilities');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="civic-nav-link"
            >
              AI Capabilities
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('city-map');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="civic-nav-link"
            >
              Live GIS Map
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('governance-workflow');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="civic-nav-link"
            >
              Governance Workflow
            </button>
            <button 
              onClick={() => onNavigate('duplicates')} 
              className="civic-nav-link"
            >
              <Copy size={14} style={{ color: 'var(--civic-orange)' }} /> Duplicate Forensics
            </button>
          </div>

          {/* Authority Access or Active Session */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated && currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: 'rgba(255,255,255,0.06)', 
                  border: '1px solid rgba(255,255,255,0.12)', 
                  padding: '6px 14px', 
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {currentUser.role === 'worker' ? (
                    <HardHat size={14} style={{ color: '#38bdf8' }} />
                  ) : (
                    <ShieldCheck size={14} style={{ color: 'var(--civic-orange)' }} />
                  )}
                  <span style={{ fontWeight: '600', color: '#fff' }}>{currentUser.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="btn-civic-secondary"
                  style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={onAuthorityLogin}
                className="btn-civic-primary"
                style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '6px' }}
              >
                <ShieldCheck size={15} /> Authority Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="civic-hero">
        <div className="civic-hero-grid">
          
          {/* Hero Left: Strategic Proposition */}
          <div>
            <div className="civic-badge-pill">
              <Zap size={14} /> AI-POWERED URBAN INFRASTRUCTURE PLATFORM
            </div>

            <h1 className="civic-hero-h1">
              Empowering Citizens, <br />
              <span className="orange-highlight">Building Better Cities.</span>
            </h1>

            <p className="civic-hero-desc">
              MAATRAM is a next-generation civic technology platform that transforms ordinary smartphone photos into authenticated, geotagged infrastructure work orders. Powered by on-device computer vision, spatial clustering, and automated government docketing.
            </p>

            {/* CTAs */}
            <div className="civic-hero-ctas">
              <button 
                onClick={onGetStarted}
                className="btn-civic-primary"
                style={{ fontSize: '15px', padding: '14px 28px' }}
              >
                <Camera size={18} /> Report an Issue <ArrowRight size={16} />
              </button>

              <button 
                onClick={onViewMap}
                className="btn-civic-secondary"
                style={{ fontSize: '15px', padding: '14px 28px' }}
              >
                <MapPin size={18} /> Explore Live Map
              </button>
            </div>

            {/* Institutional Trust Indicators */}
            <div className="civic-trust-strip">
              <div className="trust-item">
                <Shield size={14} style={{ color: '#10b981' }} />
                <span>Section 133 CrPC Statutory Compliance</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={14} style={{ color: '#38bdf8' }} />
                <span>YOLOv8 & SSIM Verification</span>
              </div>
              <div className="trust-item">
                <MapPin size={14} style={{ color: 'var(--civic-orange)' }} />
                <span>Sub-meter GPS Geo-Fencing</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive AI Detection Preview Widget */}
          <div className="ai-preview-card">
            
            {/* Top Bar with Scenario Tabs */}
            <div className="ai-preview-top-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#10b981', 
                  display: 'inline-block' 
                }} />
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--civic-text-subtle)', fontWeight: '700' }}>
                  YOLOv8_VISION_ACTIVE
                </span>
              </div>

              {/* Scenario Switchers */}
              <div className="ai-scenario-tabs">
                {Object.keys(scenarios).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveScenarioKey(key)}
                    className={`scenario-tab ${activeScenarioKey === key ? 'active ' + key : ''}`}
                  >
                    {scenarios[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Viewport Canvas with Dynamic Detection Box */}
            <div className="ai-preview-viewport">
              <img 
                src={currentScenario.img} 
                alt={currentScenario.name} 
                className="ai-preview-img"
              />

              {/* Animated AI Bounding Box */}
              {showBbox && (
                <div 
                  className="ai-bounding-box"
                  style={{
                    top: currentScenario.box.top,
                    left: currentScenario.box.left,
                    width: currentScenario.box.width,
                    height: currentScenario.box.height,
                  }}
                >
                  <span className="ai-bbox-label">
                    {currentScenario.name} {currentScenario.confidence.split(' ')[0]}
                  </span>
                </div>
              )}

              {/* Subtle Scanline Overlay */}
              <div className="ai-scanline" />

              {/* Viewport Overlay Controls */}
              <div style={{ 
                position: 'absolute', 
                bottom: '10px', 
                right: '10px', 
                display: 'flex', 
                gap: '6px' 
              }}>
                <button
                  type="button"
                  onClick={() => setShowBbox(!showBbox)}
                  style={{
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: showBbox ? 'var(--civic-orange)' : '#94a3b8',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {showBbox ? 'Bounding Box: ON' : 'Bounding Box: OFF'}
                </button>
              </div>
            </div>

            {/* Telemetry HUD Panel */}
            <div className="ai-hud-grid">
              <div className="ai-hud-item">
                <span className="ai-hud-label">Issue Category</span>
                <span className="ai-hud-val" style={{ color: '#fff' }}>{currentScenario.category}</span>
              </div>

              <div className="ai-hud-item">
                <span className="ai-hud-label">Confidence Score</span>
                <span className="ai-hud-val" style={{ color: '#10b981' }}>{currentScenario.confidence}</span>
              </div>

              <div className="ai-hud-item">
                <span className="ai-hud-label">GPS Geolocation</span>
                <span className="ai-hud-val" style={{ fontFamily: 'monospace', fontSize: '11px' }}>{currentScenario.location}</span>
              </div>

              <div className="ai-hud-item">
                <span className="ai-hud-label">Verification Status</span>
                <span className="ai-hud-val" style={{ color: 'var(--civic-orange)', fontSize: '11px' }}>{currentScenario.verification}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SECTION 1: LIVE PLATFORM STATISTICS */}
      <section style={{ borderTop: '1px solid var(--civic-border)', borderBottom: '1px solid var(--civic-border)', background: '#11151d' }}>
        <div className="civic-section-wrapper" style={{ padding: '40px 28px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#10b981', 
                display: 'inline-block' 
              }} />
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#10b981' }}>
                LIVE MUNICIPAL DISPATCH TELEMETRY • THANJAVUR CORPORATION
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--civic-text-subtle)' }}>
              Updated in real-time across 54 municipal wards
            </span>
          </div>

          <div className="civic-stats-grid">
            <div className="civic-stat-card">
              <div className="civic-stat-num">1,280+</div>
              <div className="civic-stat-label">Issues Documented</div>
              <div className="civic-stat-sub">Across all municipal sectors</div>
            </div>

            <div className="civic-stat-card">
              <div className="civic-stat-num">97.8%</div>
              <div className="civic-stat-label">AI Verification Rate</div>
              <div className="civic-stat-sub">Optical sensor & ELA precision</div>
            </div>

            <div className="civic-stat-card">
              <div className="civic-stat-num">24.4h</div>
              <div className="civic-stat-label">Average Resolution SLA</div>
              <div className="civic-stat-sub">Statutory rapid turnaround</div>
            </div>

            <div className="civic-stat-card">
              <div className="civic-stat-num">180+</div>
              <div className="civic-stat-label">Worker Hours Saved</div>
              <div className="civic-stat-sub">Duplicate dispatches eliminated</div>
            </div>

            <div className="civic-stat-card">
              <div className="civic-stat-num">50m</div>
              <div className="civic-stat-label">Spatial Deduplication</div>
              <div className="civic-stat-sub">Haversine clustering radius</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SECTION 2: HOW MAATRAM WORKS */}
      <section id="how-it-works" className="civic-section-wrapper">
        <div className="civic-section-header">
          <span className="civic-section-tag">PROGRESSIVE MUNICIPAL PIPELINE</span>
          <h2 className="civic-section-h2">How MAATRAM Works</h2>
          <p className="civic-section-desc">
            From the moment a citizen captures an infrastructure hazard on-site to final automated AI verification, the workflow is transparent, auditable, and binding.
          </p>
        </div>

        <div className="civic-steps-grid">
          <div className="civic-step-card">
            <div className="civic-step-num">01</div>
            <h3 className="civic-step-title">Document & Geotag</h3>
            <p className="civic-step-desc">
              Citizens capture a live photo of the hazard. The application automatically extracts hardware EXIF markers and embeds high-precision GPS coordinates.
            </p>
          </div>

          <div className="civic-step-card">
            <div className="civic-step-num">02</div>
            <h3 className="civic-step-title">Forensic AI Analysis</h3>
            <p className="civic-step-desc">
              The forensic engine tests PRNU photon shot noise and Error Level Analysis (ELA) to weed out synthetic AI images, while spatial algorithms check for 50m duplicates.
            </p>
          </div>

          <div className="civic-step-card">
            <div className="civic-step-num">03</div>
            <h3 className="civic-step-title">Statutory Docketing</h3>
            <p className="civic-step-desc">
              An official Government Grievance Docket is generated under Section 133 CrPC and instantly dispatched to the appropriate municipal engineering squad.
            </p>
          </div>

          <div className="civic-step-card">
            <div className="civic-step-num">04</div>
            <h3 className="civic-step-title">Verified Resolution</h3>
            <p className="civic-step-desc">
              Field workers upload proof of repair. OpenCV structural similarity (SSIM) algorithms mathematically verify hazard removal before closing the ticket.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: AI CAPABILITIES */}
      <section id="ai-capabilities" style={{ background: '#11151d', borderTop: '1px solid var(--civic-border)', borderBottom: '1px solid var(--civic-border)' }}>
        <div className="civic-section-wrapper">
          <div className="civic-section-header">
            <span className="civic-section-tag">DEEP-TECH ARCHITECTURE</span>
            <h2 className="civic-section-h2">Intelligent Infrastructure Capabilities</h2>
            <p className="civic-section-desc">
              MAATRAM combines computer vision, image forensics, and GIS spatial intelligence to modernize municipal governance.
            </p>
          </div>

          <div className="civic-cap-grid">
            <div className="civic-cap-card featured">
              <div className="civic-cap-icon-box">
                <Eye size={22} />
              </div>
              <h3 className="civic-cap-title">YOLOv8 Hazard Detection</h3>
              <p className="civic-cap-desc">
                Fine-tuned neural networks identify potholes, craters, open drains, garbage dumps, and damaged streetlights with microsecond inference.
              </p>
            </div>

            <div className="civic-cap-card">
              <div className="civic-cap-icon-box">
                <Shield size={22} />
              </div>
              <h3 className="civic-cap-title">Sensor Forensics & PRNU Profiling</h3>
              <p className="civic-cap-desc">
                Extracts physical camera sensor grain (Poisson shot noise) to reject synthesized AI images (Midjourney, DALL-E, Flux) and ensure real on-site captures.
              </p>
            </div>

            <div className="civic-cap-card">
              <div className="civic-cap-icon-box">
                <Layers size={22} />
              </div>
              <h3 className="civic-cap-title">Error Level Analysis (ELA)</h3>
              <p className="civic-cap-desc">
                Re-compresses images at fixed quantization levels to detect image tampering, digital splicing, or recycled social media photographs.
              </p>
            </div>

            <div className="civic-cap-card">
              <div className="civic-cap-icon-box">
                <MapPin size={22} />
              </div>
              <h3 className="civic-cap-title">Geospatial Haversine Deduplication</h3>
              <p className="civic-cap-desc">
                Clusters recurring citizen submissions within a 50-meter radius, linking them to a single Master Record to eliminate redundant contractor dispatch.
              </p>
            </div>

            <div className="civic-cap-card">
              <div className="civic-cap-icon-box">
                <Building2 size={22} />
              </div>
              <h3 className="civic-cap-title">Automated Departmental Routing</h3>
              <p className="civic-cap-desc">
                Directly maps detected hazard types to responsible municipal authorities (Roads, Water, Sanitation, Electrical) without human bottleneck delays.
              </p>
            </div>

            <div className="civic-cap-card">
              <div className="civic-cap-icon-box">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="civic-cap-title">Before-and-After SSIM Verification</h3>
              <p className="civic-cap-desc">
                Computes structural similarity metrics between the original reported issue and the field worker's proof photo, certifying the defect is resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: INTERACTIVE ISSUE MAP PREVIEW */}
      <section id="city-map" className="civic-section-wrapper">
        <div className="civic-section-header">
          <span className="civic-section-tag">GEOSPATIAL SITUATIONAL AWARENESS</span>
          <h2 className="civic-section-h2">Thanjavur Municipal Hazard Map</h2>
          <p className="civic-section-desc">
            Real-time geospatial distribution of civic issues. Explore hot-zones, inspect localized severity clusters, and monitor field work order progression.
          </p>
        </div>

        <div className="civic-map-box">
          <div className="civic-map-controls">
            <div>
              <strong style={{ fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} style={{ color: 'var(--civic-orange)' }} />
                Active City GIS Cluster Map (100 Verified Coordinates)
              </strong>
              <div style={{ fontSize: '12px', color: 'var(--civic-text-muted)', marginTop: '2px' }}>
                Coordinates distributed across Thanjavur Municipal Corporation jurisdiction.
              </div>
            </div>

            <button 
              onClick={onViewMap}
              className="btn-civic-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Open Full GIS Console <ExternalLink size={14} />
            </button>
          </div>

          {/* Embedded Real IssueMap Component */}
          <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--civic-border)' }}>
            <IssueMap />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--civic-text-muted)' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} /> High Priority (40)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} /> Medium Priority (30)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} /> Resolved (30)
              </span>
            </div>
            <span>Click any marker to inspect ticket ID and telemetry</span>
          </div>
        </div>
      </section>

      {/* 7. SECTION 5: CITIZEN-TO-AUTHORITY WORKFLOW */}
      <section id="governance-workflow" style={{ background: '#11151d', borderTop: '1px solid var(--civic-border)', borderBottom: '1px solid var(--civic-border)' }}>
        <div className="civic-section-wrapper">
          <div className="civic-section-header">
            <span className="civic-section-tag">MULTI-TIER INTEGRATION</span>
            <h2 className="civic-section-h2">Citizen-to-Authority Architecture</h2>
            <p className="civic-section-desc">
              Bridging the gap between the citizen on the street, the administrative executive, and the field engineering contractor.
            </p>
          </div>

          <div className="civic-pipeline-grid">
            {/* Tier 1: Citizen Layer */}
            <div className="civic-pipeline-card">
              <span className="pipeline-tier-tag">TIER 1 • CITIZEN ACCESS</span>
              <h3 className="pipeline-h3">Capture & File</h3>
              <p style={{ fontSize: '13px', color: 'var(--civic-text-muted)', lineHeight: '1.5' }}>
                Instant reporting without complex forms. Citizens capture an image on their mobile phone and receive a verified Government Docket.
              </p>
              <ul className="pipeline-list">
                <li><Check size={15} style={{ color: '#10b981', flexShrink: 0 }} /> Zero login barrier for fast on-site reporting</li>
                <li><Check size={15} style={{ color: '#10b981', flexShrink: 0 }} /> Sub-meter hardware GPS stamping</li>
                <li><Check size={15} style={{ color: '#10b981', flexShrink: 0 }} /> Official statutory PDF grievance certificate</li>
              </ul>
            </div>

            {/* Tier 2: Municipal Engine */}
            <div className="civic-pipeline-card center-tier" style={{ borderColor: 'rgba(255, 121, 0, 0.35)', background: '#171c26' }}>
              <span className="pipeline-tier-tag">TIER 2 • MUNICIPAL ENGINE</span>
              <h3 className="pipeline-h3">Triage & Cluster</h3>
              <p style={{ fontSize: '13px', color: 'var(--civic-text-muted)', lineHeight: '1.5' }}>
                Central intelligence layer that validates image authenticity, runs spatial deduplication, and generates executive department dispatches.
              </p>
              <ul className="pipeline-list">
                <li><Check size={15} style={{ color: 'var(--civic-orange)', flexShrink: 0 }} /> PRNU photon noise & ELA anti-spoofing</li>
                <li><Check size={15} style={{ color: 'var(--civic-orange)', flexShrink: 0 }} /> 50-meter Haversine proximity clustering</li>
                <li><Check size={15} style={{ color: 'var(--civic-orange)', flexShrink: 0 }} /> Real-time administrative triage dashboard</li>
              </ul>
            </div>

            {/* Tier 3: Field Operations */}
            <div className="civic-pipeline-card">
              <span className="pipeline-tier-tag">TIER 3 • FIELD OPERATIONS</span>
              <h3 className="pipeline-h3">Execute & Verify</h3>
              <p style={{ fontSize: '13px', color: 'var(--civic-text-muted)', lineHeight: '1.5' }}>
                Field engineering teams receive geofenced task queues. Upon completing repairs, photo evidence is mathematically verified by AI.
              </p>
              <ul className="pipeline-list">
                <li><Check size={15} style={{ color: '#0284c7', flexShrink: 0 }} /> Role-restricted worker queue access</li>
                <li><Check size={15} style={{ color: '#0284c7', flexShrink: 0 }} /> GPS navigation to defect locus</li>
                <li><Check size={15} style={{ color: '#0284c7', flexShrink: 0 }} /> OpenCV SSIM before-and-after proof closeout</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: PUBLIC IMPACT & ACCOUNTABILITY */}
      <section className="civic-section-wrapper">
        <div className="civic-impact-container">
          <div>
            <div className="civic-badge-pill" style={{ marginBottom: '14px' }}>
              <Award size={14} /> ACCOUNTABILITY & GOVERNANCE
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', margin: '0 0 16px 0', color: '#fff' }}>
              Built for Municipal Transparency & Rapid Remediation
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--civic-text-muted)', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              "By integrating on-device computer vision and automatic statutory docketing, MAATRAM has streamlined municipal grievance resolution. Redundant complaint filings are eliminated within minutes, and public trust is reinforced through verifiable AI closeout."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#0f172a', border: '1.5px solid var(--civic-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff' }}>
                🏛️
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#fff' }}>Thanjavur City Municipal Corporation</strong>
                <span style={{ fontSize: '12px', color: 'var(--civic-text-muted)' }}>Public Works & Urban Local Governance Division</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--civic-border)', padding: '16px 20px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--civic-orange)', fontWeight: '700' }}>
                Taxpayer Savings
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                ₹18.4 Lakhs Conserved
              </div>
              <div style={{ fontSize: '12px', color: 'var(--civic-text-muted)', marginTop: '2px' }}>
                Zero duplicate contractor disbursements
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--civic-border)', padding: '16px 20px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#38bdf8', fontWeight: '700' }}>
                Citizen Satisfaction
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                94.6% Approval
              </div>
              <div style={{ fontSize: '12px', color: 'var(--civic-text-muted)', marginTop: '2px' }}>
                Across verified remediation trials
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION 7: PROFESSIONAL INSTITUTIONAL FOOTER */}
      <footer className="civic-footer">
        <div className="civic-footer-inner">
          <div className="civic-footer-grid">
            
            {/* Col 1: Identity & Mission */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Logo size="medium" onClick={() => onNavigate('home')} />
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--civic-text-muted)', maxWidth: '340px' }}>
                MAATRAM (மாற்றம்) is an open civic infrastructure intelligence platform empowering residents, engineers, and municipal authorities with automated hazard detection and transparent remediation.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>All Municipal Systems Operational • IPGR-CIS Protocol</span>
              </div>
            </div>

            {/* Col 2: Platform Modules */}
            <div>
              <h4 className="footer-col-title">Platform</h4>
              <ul className="footer-col-links">
                <li><button onClick={() => onNavigate('reporter')}>Citizen Reporter</button></li>
                <li><button onClick={() => onNavigate('duplicates')}>Duplicate Forensics</button></li>
                <li><button onClick={() => onNavigate('admin')}>Admin GIS Dashboard</button></li>
                <li><button onClick={() => onNavigate('worker')}>Worker Task Queue</button></li>
                <li><button onClick={onViewMap}>Interactive City Map</button></li>
              </ul>
            </div>

            {/* Col 3: Statutory Governance */}
            <div>
              <h4 className="footer-col-title">Governance</h4>
              <ul className="footer-col-links">
                <li><button onClick={() => onNavigate('reporter')}>Section 133 CrPC Orders</button></li>
                <li><button onClick={() => onNavigate('admin')}>Tamil Nadu ULB Act, 1998</button></li>
                <li><button onClick={() => onNavigate('admin')}>48-Hour Resolution SLA</button></li>
                <li><button onClick={() => onNavigate('duplicates')}>Haversine Spatial Policy</button></li>
                <li><button onClick={() => onNavigate('admin')}>Digital Grievance Gazette</button></li>
              </ul>
            </div>

            {/* Col 4: Authority & Security */}
            <div>
              <h4 className="footer-col-title">Authority Access</h4>
              <ul className="footer-col-links">
                <li>
                  {isAuthenticated ? (
                    <button onClick={onLogout} style={{ color: '#ef4444', fontWeight: '700' }}>
                      Sign Out ({currentUser?.name})
                    </button>
                  ) : (
                    <button onClick={onAuthorityLogin} style={{ color: 'var(--civic-orange)', fontWeight: '700' }}>
                      Authority Portal Sign In →
                    </button>
                  )}
                </li>
                <li><button onClick={() => onNavigate('admin')}>Executive Engineer Login</button></li>
                <li><button onClick={() => onNavigate('worker')}>Field Specialist Gateway</button></li>
                <li><button onClick={() => onNavigate('home')}>Help Desk (Toll Free: 1913)</button></li>
                <li><button onClick={() => onNavigate('home')}>Thanjavur City Corporation</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="civic-footer-bottom">
            <div>
              © {new Date().getFullYear()} MAATRAM Civic Technology Platform. Developed for Smart Municipal Administration.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Privacy & Geolocation Policy</span>
              <span>Statutory Compliance</span>
              <span>Terms of Public Service</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
