import React from 'react';
import { 
  Clock, Users, Building, ShieldCheck, AlertCircle, MapPin, 
  Eye, AlertTriangle, CheckCircle, ChevronRight, HardHat
} from 'lucide-react';

const IssueTable = ({ reports = [], onAssignDepartment, onUpdateStatus, onViewComplaint }) => {
  if (reports.length === 0) {
    return (
      <div className="table-wrapper glass-panel loading-state" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        No municipal complaints match your active filter criteria.
      </div>
    );
  }

  // Format Complaint ID to clean MTR-2026 standard
  const formatComplaintId = (id = '') => {
    if (id.startsWith('MTR-')) return id;
    const numPart = id.replace(/[^0-9]/g, '');
    const padded = numPart ? numPart.padStart(5, '0') : '00104';
    return `MTR-2026-${padded}`;
  };

  const getPriorityBadge = (severity = 'Medium') => {
    switch (severity) {
      case 'Critical':
        return { bg: 'rgba(220, 38, 38, 0.15)', text: '#dc2626', border: 'rgba(220, 38, 38, 0.3)' };
      case 'High':
        return { bg: 'rgba(234, 88, 12, 0.15)', text: '#ea580c', border: 'rgba(234, 88, 12, 0.3)' };
      case 'Medium':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Low':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
      default:
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Desktop Tabular View (Screens > 768px) */}
      <div className="desktop-table-view table-wrapper glass-panel" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Category</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Assigned Department</th>
              <th>Status</th>
              <th>Submission Date</th>
              <th style={{ textAlign: 'center' }}>View Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const complaintId = formatComplaintId(report._id);
              const priority = getPriorityBadge(report.severity);
              const coords = report.location?.coordinates;
              const locationStr = coords ? `${coords[1].toFixed(4)}° N, ${coords[0].toFixed(4)}° E` : 'Thanjavur Sector';

              return (
                <tr key={report._id}>
                  {/* Complaint ID */}
                  <td>
                    <strong style={{ color: '#ff7900', fontSize: '13px', fontFamily: 'monospace' }}>
                      {complaintId}
                    </strong>
                  </td>

                  {/* Category */}
                  <td>
                    <strong style={{ color: '#ffffff', fontSize: '13px' }}>
                      {report.detectedIssue || report.title || 'Civic Anomaly'}
                    </strong>
                    <div style={{ fontSize: '11px', color: '#94a3b8', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {report.description}
                    </div>
                  </td>

                  {/* Location */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <MapPin size={13} style={{ color: '#ff7900', flexShrink: 0 }} />
                      <span>{locationStr}</span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: priority.bg,
                      color: priority.text,
                      border: `1px solid ${priority.border}`,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: priority.text }} />
                      {report.severity || 'Medium'}
                    </span>
                  </td>

                  {/* Assigned Department */}
                  <td>
                    <select 
                      className="department-select" 
                      value={report.department || ''}
                      onChange={(e) => onAssignDepartment && onAssignDepartment(report._id, e.target.value)}
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                    >
                      <option value="" disabled>Assign Department...</option>
                      <option value="Road Works">Highways & Road Works</option>
                      <option value="Sanitation">Sanitation & Solid Waste</option>
                      <option value="Water Supply">Water Supply & Sewerage</option>
                      <option value="Electrical">Electrical Engineering</option>
                      <option value="Parks">Parks & Urban Forestry</option>
                    </select>
                  </td>

                  {/* Status */}
                  <td>
                    <select 
                      className="department-select" 
                      value={report.status || 'pending'}
                      onChange={(e) => onUpdateStatus && onUpdateStatus(report._id, e.target.value)}
                      style={{ 
                        fontSize: '12px', 
                        padding: '6px 8px',
                        color: report.status === 'resolved' ? '#10b981' : report.status === 'in-progress' ? '#38bdf8' : '#f59e0b',
                        fontWeight: '700'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Submission Date */}
                  <td style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '08 Oct 2026'}
                  </td>

                  {/* View Action */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onViewComplaint && onViewComplaint(report)}
                      style={{ 
                        padding: '4px 10px', 
                        fontSize: '12px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px' 
                      }}
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Responsive Cards View (Phones <= 768px) */}
      <div className="mobile-cards-view">
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#ff7900', textTransform: 'uppercase', marginBottom: '4px' }}>
          Active Grievance Tickets ({reports.length})
        </div>

        {reports.map((report) => {
          const complaintId = formatComplaintId(report._id);
          const priority = getPriorityBadge(report.severity);
          const coords = report.location?.coordinates;
          const locationStr = coords ? `${coords[1].toFixed(4)}°, ${coords[0].toFixed(4)}°` : 'Thanjavur';

          return (
            <div key={report._id} className="mobile-ticket-card glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ff7900', fontWeight: '800', fontSize: '12px', fontFamily: 'monospace' }}>
                  {complaintId}
                </span>
                <span style={{
                  background: priority.bg,
                  color: priority.text,
                  border: `1px solid ${priority.border}`,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '800'
                }}>
                  {report.severity || 'Medium'}
                </span>
              </div>

              <h4 style={{ margin: '4px 0', fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                {report.detectedIssue || report.title || 'Civic Ticket'}
              </h4>

              <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} style={{ color: '#ff7900' }} /> {locationStr}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Department</span>
                  <select 
                    className="department-select" 
                    value={report.department || ''}
                    onChange={(e) => onAssignDepartment && onAssignDepartment(report._id, e.target.value)}
                    style={{ width: '100%', fontSize: '11px', padding: '4px' }}
                  >
                    <option value="" disabled>Assign...</option>
                    <option value="Road Works">Road Works</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Status</span>
                  <select 
                    className="department-select" 
                    value={report.status || 'pending'}
                    onChange={(e) => onUpdateStatus && onUpdateStatus(report._id, e.target.value)}
                    style={{ width: '100%', fontSize: '11px', padding: '4px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onViewComplaint && onViewComplaint(report)}
                style={{ width: '100%', padding: '6px', fontSize: '12px', marginTop: '6px', justifyContent: 'center' }}
              >
                <Eye size={14} style={{ marginRight: '6px' }} /> View Incident Detail
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default IssueTable;
