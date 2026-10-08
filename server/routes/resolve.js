import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';
import Report from '../models/Report.js';
import { runVerification } from '../services/verifyService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config (should match what's in server.js ideally, but for now we'll define it here)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Traverse up to server/uploads
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/resolve/:id
router.post('/:id', upload.single('proofImage'), async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Proof image is required' });
    if (!workerId) return res.status(400).json({ error: 'Worker ID is required' });
    
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    // Validate state
    if (report.status !== 'in-progress') {
      return res.status(409).json({ error: 'Report is not in progress. Cannot resolve.' });
    }
    
    // Save image path and log resolving state
    report.proofOfFixImagePath = `/uploads/${req.file.filename}`;
    report.statusHistory.push({
      from: 'in-progress',
      to: 'resolving',
      by: workerId,
      at: new Date()
    });
    // Temporary status while AI checks
    report.status = 'in-progress'; 
    await report.save();

    // Construct local filesystem paths for AI
    const originalImagePath = path.join(__dirname, '..', report.imagePath.replace(/^\/uploads\//, 'uploads/'));
    const fixedImagePath = path.join(__dirname, '..', req.file.path.replace(/^.*uploads\\/, 'uploads\\'));
    
    // Trigger automated AI check verification (Phase 7)
    runVerification(report, originalImagePath, fixedImagePath, workerId);
    
    // Asynchronous acceptance
    res.status(202).json({ message: 'Proof uploaded successfully. AI is verifying the fix.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to resolve issue' });
  }
});

export default router;
