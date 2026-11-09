import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, Filter, Search, Calendar, MapPin, AlertTriangle, 
  CheckCircle2, Clock, Building2, Eye, X, ChevronRight, HardHat, Compass
} from 'lucide-react';

const IssueMap = ({ reports = [], onSelectReport }) => {
  const defaultCenter = [10.78694, 79.13782]; // Thanjavur, Tamil Nadu

  // Search & Filter State
  const [searchLocation, setSearchLocation] = useState('');
  const [dateFilter, setDateFilter] = useState('All'); // 'All' | '24h' | '7d' | '30d'

  // Exact Requested MAP LAYERS:
  // ☑ Potholes
  // ☑ Garbage
  // ☑ Water Leakage
  // ☑ Streetlights
  const [layerFilters, setLayerFilters] = useState({
    potholes: true,
    garbage: true,
    water: true,
    streetlights: true
  });

  // Exact Requested SEVERITY:
  // ● Critical
  // ● High
  // ● Medium
  // ● Low
  const [severityFilters, setSeverityFilters] = useState({
    Critical: true,
    High: true,
    Medium: true,
    Low: true
  });

  // Selected Complaint for Detail Panel
  const [activeComplaint, setActiveComplaint] = useState(null);

  // Helper to map issue text to layer key
  const getLayerKey = (issueType = '', title = '') => {
    const text = `${issueType} ${title}`.toLowerCase();
    if (text.includes('pothole') || text.includes('crater') || text.includes('road')) return 'potholes';
    if (text.includes('garbage') || text.includes('waste') || text.includes('trash')) return 'garbage';
    if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain')) return 'water';
    if (text.includes('light') || text.includes('lamp') || text.includes('electric')) return 'streetlights';
    return 'potholes';
  };

  // Severity color mapping
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return '#dc2626'; // Deep Crimson
      case 'High':
        return '#ea580c'; // Vibrant Red-Orange
      case 'Medium':
        return '#f59e0b'; // Amber
      case 'Low':
        return '#10b981'; // Emerald Green
      default:
        return '#38bdf8'; // Blue
    }
  };

  // Filtered reports calculation
  const filteredReports = useMemo(() => {
    const now = Date.now();
    return reports.filter((r) => {
      // 1. Layer filter
      const layerKey = getLayerKey(r.detectedIssue, r.title);
      if (!layerFilters[layerKey]) return false;

      // 2. Severity filter
      const sev = r.severity || 'Medium';
      if (!severityFilters[sev]) return false;

      // 3. Date filter
      if (dateFilter !== 'All' && r.createdAt) {
        const reportTime = new Date(r.createdAt).getTime();
        const diffMs = now - reportTime;
        if (dateFilter === '24h' && diffMs > 24 * 3600 * 1000) return false;
        if (dateFilter === '7d' && diffMs > 7 * 24 * 3600 * 1000) return false;
        if (dateFilter === '30d' && diffMs > 30 * 24 * 3600 * 1000) return false;
      }

      // 4. Location search filter
      if (searchLocation.trim()) {
        const query = searchLocation.toLowerCase();
        const titleMatch = (r.title || '').toLowerCase().includes(query);
        const descMatch = (r.description || '').toLowerCase().includes(query);
        const deptMatch = (r.department || '').toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !deptMatch) return false;
      }

      return true;
    });
  }, [reports, layerFilters, severityFilters, dateFilter, searchLocation]);

  const toggleLayer = (key) => {
    setLayerFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSeverity = (key) => {
    setSeverityFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMarkerClick = (report) => {
    setActiveComplaint(report);
    if (onSelectReport) onSelectReport(report);
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#0b0f17', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)' }}>
      
      {/* Top GIS Control & Search Bar */}
      <div style={{
        background: '#11141c',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'rgba(255, 121, 0, 0.15)',
            color: '#ff7900',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.8px',
            textTransform: 'uppercase'
          }}>
            GIS COMMAND CENTER
          </span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
            Thanjavur Municipal Spatial Grid
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            ({filteredReports.length} of {reports.length} Active Markers)
          </span>
        </div>

        {/* Location Search & Date Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search ward, street, issue..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 30px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} style={{ color: '#94a3b8' }} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Dates</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Viewport Frame */}
      <div style={{ position: 'relative', height: '540px', width: '100%' }}>
        
        {/* =================================================================
            EXACT MAP CONTROL PANEL (FLOATING OVER MAP)
           ================================================================= */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 1000,
            background: 'rgba(15, 20, 28, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '16px',
            color: '#ffffff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            width: '210px',
            fontFamily: 'inherit'
          }}
        >
          {/* MAP LAYERS HEADER */}
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '800', 
            letterSpacing: '1px', 
            textTransform: 'uppercase', 
            color: '#ff7900', 
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Layers size={13} /> MAP LAYERS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={layerFilters.potholes} 
                onChange={() => toggleLayer('potholes')}
                style={{ accentColor: '#ff7900', cursor: 'pointer' }} 
              />
              <span>Potholes</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={layerFilters.garbage} 
                onChange={() => toggleLayer('garbage')}
                style={{ accentColor: '#ff7900', cursor: 'pointer' }} 
              />
              <span>Garbage</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={layerFilters.water} 
                onChange={() => toggleLayer('water')}
                style={{ accentColor: '#ff7900', cursor: 'pointer' }} 
              />
              <span>Water Leakage</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={layerFilters.streetlights} 
                onChange={() => toggleLayer('streetlights')}
                style={{ accentColor: '#ff7900', cursor: 'pointer' }} 
              />
              <span>Streetlights</span>
            </label>
          </div>

          {/* SEVERITY HEADER */}
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '800', 
            letterSpacing: '1px', 
            textTransform: 'uppercase', 
            color: '#ff7900', 
            marginBottom: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertTriangle size={13} /> SEVERITY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={severityFilters.Critical} 
                onChange={() => toggleSeverity('Critical')}
                style={{ accentColor: '#dc2626', cursor: 'pointer' }} 
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} /> Critical
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={severityFilters.High} 
                onChange={() => toggleSeverity('High')}
                style={{ accentColor: '#ea580c', cursor: 'pointer' }} 
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }} /> High
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={severityFilters.Medium} 
                onChange={() => toggleSeverity('Medium')}
                style={{ accentColor: '#f59e0b', cursor: 'pointer' }} 
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Medium
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={severityFilters.Low} 
                onChange={() => toggleSeverity('Low')}
                style={{ accentColor: '#10b981', cursor: 'pointer' }} 
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Low
              </span>
            </label>
          </div>

        </div>

        {/* Leaflet MapContainer */}
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredReports.map((report) => {
            if (!report.location || !report.location.coordinates) return null;
            const coords = [report.location.coordinates[1], report.location.coordinates[0]];
            const color = getSeverityColor(report.severity);
            const isSelected = activeComplaint?._id === report._id;

            return (
              <CircleMarker
                key={report._id}
                center={coords}
                pathOptions={{
                  color: isSelected ? '#ffffff' : color,
                  fillColor: color,
                  fillOpacity: isSelected ? 1 : 0.85,
                  weight: isSelected ? 3 : 2
                }}
                radius={isSelected ? 14 : 9}
                eventHandlers={{
                  click: () => handleMarkerClick(report)
                }}
              >
                <Popup>
                  <div style={{ minWidth: '190px', fontFamily: 'sans-serif', fontSize: '13px', color: '#0f172a' }}>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                      {report.title || report.detectedIssue}
                    </strong>
                    <div style={{ margin: '4px 0', fontSize: '12px' }}>
                      Severity: <span style={{ color: color, fontWeight: '800' }}>{report.severity || 'Medium'}</span>
                    </div>
                    <div style={{ margin: '4px 0', fontSize: '12px' }}>
                      Status: <strong style={{ textTransform: 'capitalize' }}>{report.status || 'pending'}</strong>
                    </div>
                    <div style={{ margin: '4px 0', fontSize: '12px' }}>
                      Dept: <strong>{report.department || 'Unassigned'}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkerClick(report)}
                      style={{
                        marginTop: '6px',
                        background: '#ff7900',
                        color: '#ffffff',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Inspect Detail Panel →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* =================================================================
            COMPLAINT DETAIL SIDE PANEL (OPENS WHEN A MARKER IS CLICKED)
           ================================================================= */}
        {activeComplaint && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              bottom: '16px',
              width: '320px',
              zIndex: 1000,
              background: 'rgba(15, 20, 28, 0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '20px',
              color: '#ffffff',
              boxShadow: '0 8px 36px rgba(0,0,0,0.6)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#ff7900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                COMPLAINT INSPECTOR
              </span>
              <button
                type="button"
                onClick={() => setActiveComplaint(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'monospace' }}>
                {activeComplaint._id.replace('mock-report-', 'MTR-2026-')}
              </div>
              <h3 style={{ margin: '4px 0', fontSize: '17px', fontWeight: '800', color: '#ffffff' }}>
                {activeComplaint.title || activeComplaint.detectedIssue}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                {activeComplaint.description}
              </p>
            </div>

            {/* Proof Image Preview */}
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000', height: '140px' }}>
              <img
                src={activeComplaint.imagePath ? `http://localhost:5000${activeComplaint.imagePath}` : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600'}
                alt="Complaint evidence"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Key Metadata Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Severity Priority</span>
                <span style={{ color: getSeverityColor(activeComplaint.severity), fontWeight: '800' }}>
                  {activeComplaint.severity || 'Medium'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Status</span>
                <span style={{ textTransform: 'capitalize', color: '#10b981', fontWeight: '700' }}>
                  {activeComplaint.status || 'pending'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Assigned Dept</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>
                  {activeComplaint.department || 'Road Works'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>AI Confidence</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>
                  {activeComplaint.confidence ? `${Math.round(activeComplaint.confidence * 100)}%` : '96.4%'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>GPS Location</span>
                <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>
                  {activeComplaint.location?.coordinates ? `${activeComplaint.location.coordinates[1].toFixed(4)}°, ${activeComplaint.location.coordinates[0].toFixed(4)}°` : 'Thanjavur'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => alert(`Direct dispatch instruction issued for ${activeComplaint._id} to ${activeComplaint.department || 'Road Works'}.`)}
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px', fontWeight: '700', justifyContent: 'center' }}
              >
                Dispatch Field Specialist
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default IssueMap;
