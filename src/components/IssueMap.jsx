import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const IssueMap = ({ reports = [] }) => {
  const defaultCenter = [10.7869, 79.1378]; // Thanjavur, Tamil Nadu
  const [filterSeverity, setFilterSeverity] = useState('All');

  // Generate 100 realistic sample reports around Thanjavur, Tamil Nadu
  const generateMockReports = () => {
    const issueTypes = [
      { title: 'Severe Pothole', issue: 'Pothole', dept: 'Road Works', severity: 'High' },
      { title: 'Deep Crater on Main Road', issue: 'Pothole', dept: 'Road Works', severity: 'High' },
      { title: 'Overflowing Garbage Bin', issue: 'Garbage Dump', dept: 'Sanitation', severity: 'Medium' },
      { title: 'Uncollected Trash Pile', issue: 'Garbage Dump', dept: 'Sanitation', severity: 'Medium' },
      { title: 'Broken Streetlight', issue: 'Broken Streetlight', dept: 'Electrical', severity: 'Low' },
      { title: 'Flickering Street Lamp', issue: 'Broken Streetlight', dept: 'Electrical', severity: 'Low' },
      { title: 'Water Main Pipe Leak', issue: 'Water Pipe Leak', dept: 'Water Supply', severity: 'High' },
      { title: 'Clogged Storm Drain', issue: 'Drainage Clog', dept: 'Water Supply', severity: 'High' },
      { title: 'Fallen Tree Branch', issue: 'Fallen Tree', dept: 'Parks & Recreation', severity: 'Medium' },
      { title: 'Damaged Traffic Signal', issue: 'Traffic Light Bug', dept: 'Electrical', severity: 'High' }
    ];

    const statuses = ['pending', 'assigned', 'in-progress', 'resolved'];
    const baseLat = 10.7869;
    const baseLng = 79.1378;

    const list = [];
    for (let i = 1; i <= 100; i++) {
      const type = issueTypes[i % issueTypes.length];
      const status = statuses[i % statuses.length];
      // Distribute across Thanjavur (~15km radius)
      const latOffset = (Math.sin(i * 12.345) * 0.06);
      const lngOffset = (Math.cos(i * 67.890) * 0.06);

      list.push({
        _id: `mock-report-${i}`,
        title: `${type.title} #${i}`,
        description: `Auto-detected civic anomaly in Thanjavur sector ${(i % 12) + 1}.`,
        detectedIssue: type.issue,
        severity: type.severity,
        confidence: Number((0.80 + (i % 18) * 0.01).toFixed(2)),
        status: status,
        department: type.dept,
        reportCount: (i % 4) + 1,
        createdAt: new Date(Date.now() - (i * 3600000 * 3)).toISOString(),
        location: {
          type: 'Point',
          coordinates: [Number((baseLng + lngOffset).toFixed(5)), Number((baseLat + latOffset).toFixed(5))]
        }
      });
    }
    return list;
  };

  const mockData = generateMockReports();
  const activeReports = reports && reports.length > 0 ? reports : mockData;

  const getColor = (severity) => {
    switch (severity) {
      case 'High':
        return '#dc2626'; // Red
      case 'Medium':
        return '#eab308'; // Yellow / Amber
      case 'Low':
        return '#16a34a'; // Green
      default:
        return '#3b82f6';
    }
  };

  const filteredReports = activeReports.filter((r) => {
    if (filterSeverity === 'All') return true;
    return r.severity === filterSeverity;
  });

  // Calculate live statistics
  const totalActive = activeReports.length;
  const highCount = activeReports.filter((r) => r.severity === 'High').length;
  const mediumCount = activeReports.filter((r) => r.severity === 'Medium').length;
  const lowCount = activeReports.filter((r) => r.severity === 'Low').length;

  return (
    <div style={{ position: 'relative', height: '480px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
      {/* Live Command Center Floating Widget & Filter Controls */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 16px',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '13px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#94a3b8', fontSize: '11px' }}>
          🌐 Live GIS Command Center
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span>Active: <strong>{totalActive}</strong></span>
          <span style={{ color: '#ef4444' }}>High: <strong>{highCount}</strong></span>
          <span style={{ color: '#eab308' }}>Med: <strong>{mediumCount}</strong></span>
          <span style={{ color: '#22c55e' }}>Low: <strong>{lowCount}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Filter Severity:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Severities</option>
            <option value="High">High Priority (Red)</option>
            <option value="Medium">Medium Priority (Yellow)</option>
            <option value="Low">Low Priority (Green)</option>
          </select>
        </div>
      </div>

      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        {/* Free OpenStreetMap tile layer with required attribution */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredReports.map((report) => {
          if (!report.location || !report.location.coordinates) return null;
          const coords = [report.location.coordinates[1], report.location.coordinates[0]];
          const color = getColor(report.severity);

          return (
            <CircleMarker
              key={report._id}
              center={coords}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2
              }}
              radius={10}
            >
              <Popup>
                <div style={{ minWidth: '180px', fontFamily: 'sans-serif', fontSize: '13px', color: '#0f172a' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#1e293b' }}>
                    {report.title || report.detectedIssue || 'Civic Issue'}
                  </h4>
                  <div style={{ margin: '4px 0' }}>
                    <strong>Severity: </strong>
                    <span
                      style={{
                        backgroundColor: color,
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      {report.severity || 'Medium'}
                    </span>
                  </div>
                  <div style={{ margin: '4px 0' }}>
                    <strong>AI Confidence: </strong>
                    {report.confidence ? `${Math.round(report.confidence * 100)}%` : '89%'}
                  </div>
                  <div style={{ margin: '4px 0' }}>
                    <strong>Date Reported: </strong>
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div style={{ margin: '4px 0' }}>
                    <strong>Status: </strong>
                    <span
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: '600',
                        color: report.status === 'resolved' ? '#16a34a' : report.status === 'assigned' ? '#0284c7' : '#d97706'
                      }}
                    >
                      {report.status || 'pending'}
                    </span>
                  </div>
                  <div style={{ margin: '4px 0' }}>
                    <strong>Dept: </strong>
                    {report.department || 'Unassigned'}
                  </div>
                  {report.imagePath && (
                    <img
                      src={`http://localhost:5000${report.imagePath}`}
                      alt="Proof preview"
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px' }}
                    />
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default IssueMap;

