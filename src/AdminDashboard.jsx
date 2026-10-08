import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AdminDashboard.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored icons
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const iconColors = {
  High: '#ef4444',     // Red
  critical: '#ef4444', // Red
  Medium: '#f59e0b',   // Yellow
  Low: '#10b981',      // Green
};

const getSeverityColor = (severity) => {
  const sev = severity ? severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase() : 'Medium';
  return iconColors[sev] || iconColors.Medium;
};

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports');
      const data = await response.json();
      
      // Sort logic: High severity first, then older complaints first
      const severityRank = {
        'High': 3, 'critical': 3,
        'Medium': 2,
        'Low': 1
      };

      const sortedData = data.sort((a, b) => {
        const rankA = severityRank[a.severity ? a.severity.charAt(0).toUpperCase() + a.severity.slice(1).toLowerCase() : 'Medium'] || 0;
        const rankB = severityRank[b.severity ? b.severity.charAt(0).toUpperCase() + b.severity.slice(1).toLowerCase() : 'Medium'] || 0;
        
        if (rankA !== rankB) {
          return rankB - rankA; // Higher rank first
        }
        
        // If severity is the same, older comes first (ascending order)
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setReports(sortedData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDepartment = async (id, department) => {
    try {
      const response = await fetch(`http://localhost:5000/api/report/${id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department })
      });
      if (response.ok) {
        fetchReports(); // refresh the list to see new status and department
      }
    } catch (error) {
      console.error('Error assigning department:', error);
    }
  };

  const center = [37.7749, -122.4194]; // Default center (San Francisco)

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Civic Issues Dashboard</h2>
        <p>Live map and priority ranking of reported issues</p>
      </div>

      <div className="dashboard-content">
        <div className="map-wrapper">
          <MapContainer 
            center={reports.length > 0 && reports[0].location && reports[0].location.coordinates ? [reports[0].location.coordinates[1], reports[0].location.coordinates[0]] : center} 
            zoom={12} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => {
              if (!report.location || !report.location.coordinates) return null;
              const [lng, lat] = report.location.coordinates;
              const color = getSeverityColor(report.severity);
              
              return (
                <Marker 
                  key={report._id} 
                  position={[lat, lng]} 
                  icon={createIcon(color)}
                >
                  <Popup>
                    <div className="popup-content">
                      <strong>{report.title || report.detectedIssue}</strong>
                      <p>{report.description}</p>
                      <span className={`status-badge ${report.status}`}>{report.status}</span>
                      {report.department && <div style={{marginTop: '5px', fontSize: '11px'}}>Dept: {report.department}</div>}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Issue</th>
                <th>Date Reported</th>
                <th>Status</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="loading-state">Loading reports...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="5" className="empty-state">No issues reported yet.</td></tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id} className={report.duplicateOf ? 'duplicate-row' : ''}>
                    <td>
                      <span 
                        className="severity-indicator" 
                        style={{ backgroundColor: getSeverityColor(report.severity) }}
                      ></span>
                      {report.severity}
                    </td>
                    <td>
                      <strong>{report.title || report.detectedIssue}</strong>
                      <div className="text-small">{report.description}</div>
                      {report.duplicateOf && <span className="duplicate-tag" style={{marginTop: '4px', display: 'inline-block'}}>Duplicate</span>}
                    </td>
                    <td>{new Date(report.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${report.status}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      {report.status === 'pending' || report.status === 'assigned' ? (
                        <select 
                          className="department-select"
                          value={report.department || ''} 
                          onChange={(e) => handleAssignDepartment(report._id, e.target.value)}
                        >
                          <option value="" disabled>Assign...</option>
                          <option value="Public Works">Public Works</option>
                          <option value="Sanitation">Sanitation</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Parks & Rec">Parks & Rec</option>
                        </select>
                      ) : (
                        <span className="department-label">{report.department || 'N/A'}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
