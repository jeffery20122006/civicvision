import React from 'react';
import { Clock, Users, Building, ShieldCheck, AlertCircle } from 'lucide-react';

const IssueTable = ({ reports, onAssignDepartment, onUpdateStatus }) => {
  if (reports.length === 0) {
    return (
      <div className="table-wrapper glass-panel loading-state">
        No reports match your filters.
      </div>
    );
  }

  return (
    <div>
      {/* 1. Desktop Tabular View (Screens > 768px) */}
      <div className="desktop-table-view table-wrapper glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Issue Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Department</th>
              <th>Reported Time</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>
                  <strong>{report.title || report.detectedIssue || 'Unknown Issue'}</strong>
                  <div className="text-small">{report.description}</div>
                </td>
                <td>
                  <span className="severity-indicator" style={{
                    backgroundColor: report.severity === 'High' ? '#dc2626' : report.severity === 'Medium' ? '#eab308' : '#16a34a'
                  }}></span>
                  {report.severity || 'Low'}
                </td>
                <td>
                  <select 
                    className="department-select" 
                    value={report.status}
                    onChange={(e) => onUpdateStatus(report._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <select 
                    className="department-select" 
                    value={report.department || ''}
                    onChange={(e) => onAssignDepartment(report._id, e.target.value)}
                  >
                    <option value="" disabled>Assign...</option>
                    <option value="Public Works">Public Works</option>
                    <option value="Road Works">Road Works</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Parks">Parks</option>
                  </select>
                </td>
                <td>{new Date(report.createdAt).toLocaleString()}</td>
                <td>{report.reportCount || 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Responsive Cards View (Phones <= 768px) */}
      <div className="mobile-cards-view">
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
          Active Tickets ({reports.length})
        </div>

        {reports.map((report) => (
          <div key={report._id} className="mobile-ticket-card">
            
            {/* Top Row: Title + Severity Badge */}
            <div className="ticket-card-header">
              <div>
                <h4 className="ticket-title">
                  {report.title || report.detectedIssue || 'Civic Ticket'}
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '600', marginTop: '2px' }}>
                  {report._id.replace('mock-report-', 'TICKET #')}
                </div>
              </div>

              <span className={
                report.severity === 'High' ? 'severity-pill-high' :
                report.severity === 'Medium' ? 'severity-pill-med' : 'severity-pill-low'
              }>
                {report.severity || 'Normal'}
              </span>
            </div>

            {/* Description */}
            <p className="ticket-desc">{report.description}</p>

            {/* Meta Row: Date & Report Duplicates count */}
            <div className="ticket-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {new Date(report.createdAt).toLocaleDateString()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} /> {report.reportCount || 1} Citizen Reports
              </span>
            </div>

            {/* Action Row: Interactive Status & Department Selectors */}
            <div className="ticket-actions-row">
              <div className="action-select-group">
                <label>Status</label>
                <select 
                  className="department-select" 
                  value={report.status}
                  onChange={(e) => onUpdateStatus(report._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="action-select-group">
                <label>Department</label>
                <select 
                  className="department-select" 
                  value={report.department || ''}
                  onChange={(e) => onAssignDepartment(report._id, e.target.value)}
                >
                  <option value="" disabled>Assign Dept...</option>
                  <option value="Public Works">Public Works</option>
                  <option value="Road Works">Road Works</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Parks">Parks</option>
                </select>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueTable;
