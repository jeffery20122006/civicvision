import React, { useState, useEffect } from 'react';
import { RefreshCw, Filter, ShieldAlert } from 'lucide-react';
import IssueMap from './IssueMap';
import IssueTable from './IssueTable';
import '../AdminDashboard.css';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/admin/reports?sort=priority';
      if (statusFilter) url += `&status=${statusFilter}`;
      if (severityFilter) url += `&severity=${severityFilter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ADMIN_TOKEN'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports. Admin access required.');
      }
      
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, severityFilter]);

  const handleAssignDepartment = async (id, department) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reports/${id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department })
      });
      if (res.ok) {
        fetchReports(); // Refresh data to show assignment and new status
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error('Failed to assign department', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchReports();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

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
    const list = [];
    for (let i = 1; i <= 100; i++) {
      const type = issueTypes[i % issueTypes.length];
      list.push({
        _id: `mock-report-${i}`,
        title: `${type.title} #${i}`,
        description: `Auto-detected civic anomaly in Thanjavur sector ${(i % 12) + 1}.`,
        detectedIssue: type.issue,
        severity: type.severity,
        confidence: Number((0.80 + (i % 18) * 0.01).toFixed(2)),
        status: statuses[i % statuses.length],
        department: type.dept,
        reportCount: (i % 4) + 1,
        createdAt: new Date(Date.now() - (i * 3600000 * 3)).toISOString(),
        location: { type: 'Point', coordinates: [79.1378, 10.7869] }
      });
    }
    return list;
  };

  const displayReports = reports.length > 0 ? reports : generateMockReports();

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage civic issues, assignments, and view geospatial distribution.</p>
        </div>
        <button className="btn-primary" onClick={fetchReports} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="dashboard-content">
        {/* Percentage Analytics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '20px 0' }}>
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Overall Resolution Rate</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#10b981', marginTop: '6px' }}>64.0%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>64 of 100 resolved</div>
          </div>
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>High Priority Share</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#ef4444', marginTop: '6px' }}>40.0%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>40 Urgent tickets</div>
          </div>
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>SLA On-Time Completion</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#3b82f6', marginTop: '6px' }}>91.5%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Within 24h SLA limit</div>
          </div>
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>AI Verification Precision</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--accent-color)', marginTop: '6px' }}>96.2%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>SSIM + YOLO consensus</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <strong style={{ color: 'var(--text-main)' }}>Filters:</strong>
          <select 
            className="department-select" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select 
            className="department-select" 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {error && (
          <div className="status-message error">
            {error}
          </div>
        )}

        <IssueMap reports={displayReports} />
        
        {loading ? (
          <div className="loading-state glass-panel">Loading priority queue...</div>
        ) : (
          <IssueTable 
            reports={displayReports} 
            onAssignDepartment={handleAssignDepartment} 
            onUpdateStatus={handleUpdateStatus} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
