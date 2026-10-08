import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// Helper to validate status transitions
const isValidTransition = (current, next) => {
  const flow = ['pending', 'assigned', 'in-progress', 'resolved'];
  const currentIndex = flow.indexOf(current);
  const nextIndex = flow.indexOf(next);
  
  if (currentIndex === -1 || nextIndex === -1) return false;
  // Can only move exactly one step forward
  return nextIndex === currentIndex + 1;
};

// PATCH /api/admin/reports/:id/assign
router.patch('/:id/assign', async (req, res) => {
  try {
    const { department } = req.body;
    if (!department) return res.status(400).json({ error: 'Department is required' });

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    if (report.status !== 'pending') {
      return res.status(409).json({ error: 'Report is no longer pending and cannot be assigned this way.' });
    }

    report.department = department;
    report.status = 'assigned';
    report.statusHistory.push({
      from: 'pending',
      to: 'assigned',
      by: 'Admin',
      at: new Date()
    });

    await report.save();
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to assign department' });
  }
});

// PATCH /api/admin/reports/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    
    if (!report) return res.status(404).json({ error: 'Report not found' });

    if (!isValidTransition(report.status, status)) {
      return res.status(409).json({ 
        error: `Invalid status transition from ${report.status} to ${status}. Expected pipeline: pending -> assigned -> in-progress -> resolved.` 
      });
    }

    report.statusHistory.push({
      from: report.status,
      to: status,
      by: 'Admin/System',
      at: new Date()
    });
    report.status = status;

    await report.save();
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
