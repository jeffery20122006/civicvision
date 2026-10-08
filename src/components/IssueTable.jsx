import React from 'react';

const IssueTable = ({ reports, onAssignDepartment, onUpdateStatus }) => {
  return (
    <div className="table-wrapper glass-panel">
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
          {reports.length === 0 ? (
            <tr><td colSpan="6" className="empty-state">No reports match your filters.</td></tr>
          ) : (
            reports.map((report) => (
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
                    <option value="Sanitation">Sanitation</option>
                    <option value="Streetlights">Streetlights</option>
                    <option value="Parks">Parks</option>
                  </select>
                </td>
                <td>{new Date(report.createdAt).toLocaleString()}</td>
                <td>{report.reportCount || 1}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable;
