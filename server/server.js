import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';
import Report from './models/Report.js';

// Import new route pipelines
import adminRoutes from './routes/admin.js';
import resolveRoutes from './routes/resolve.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Connect to MongoDB
// Note: Replace this connection string with your actual MongoDB URI when ready.
// For prototype purposes, we connect to a local database.
mongoose.connect('mongodb://127.0.0.1:27017/civic-mana')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/report', upload.single('image'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    let { detectedIssue, severity } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location (latitude and longitude) is required.' });
    }

    const imageFilePath = path.join(__dirname, req.file.path);

    // Run the AI pipeline script
    exec(`python ai_pipeline.py "${imageFilePath}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error("AI Script failed:", stderr);
        // If AI fails, we still proceed with default/fallback values
      } else {
        try {
          const aiResults = JSON.parse(stdout);
          if (aiResults && aiResults.length > 0) {
            detectedIssue = aiResults[0].detectedIssue;
            severity = aiResults[0].severity;
          }
        } catch (parseError) {
          console.error("Failed to parse AI script output:", parseError);
        }
      }

      try {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const issueType = detectedIssue || 'Unknown';
        const sev = severity || 'Medium';

        // 1. Check for duplicates within 50 meters
        const duplicate = await Report.findOne({
          status: { $in: ['pending', 'in-progress'] }, // unresolved issues
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              $maxDistance: 50
            }
          }
        });

        // 2. Auto-generate Title/Description and handle linking
        let title = '';
        let description = '';
        let duplicateOf = null;

        if (duplicate) {
          title = `Duplicate: ${duplicate.title || issueType}`;
          description = `This report was automatically flagged as a duplicate of an existing unresolved issue nearby.`;
          duplicateOf = duplicate._id;
        } else {
          const prefix = (sev.toLowerCase() === 'high' || sev.toLowerCase() === 'critical') ? 'URGENT: ' : '';
          const issueFormatted = issueType.charAt(0).toUpperCase() + issueType.slice(1);
          title = `${prefix}${issueFormatted} Reported`;
          description = `An AI-verified ${sev.toLowerCase()} severity ${issueType} was reported at this location. Needs review.`;
        }

        // 3. Create a new report
        const newReport = new Report({
          title,
          description,
          imagePath: `/uploads/${req.file.filename}`,
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          detectedIssue: issueType,
          severity: sev,
          duplicateOf
        });

        const savedReport = await newReport.save();
        
        res.status(201).json({
          message: duplicate ? 'Duplicate report logged' : 'Report submitted successfully',
          report: savedReport
        });
      } catch (dbError) {
        console.error('Error saving report:', dbError);
        res.status(500).json({ error: 'An error occurred while saving the report.' });
      }
    });
  } catch (error) {
    console.error('Error in report route:', error);
    res.status(500).json({ error: 'An error occurred while submitting the report.' });
  }
});

// Get all reports endpoint (for viewing)
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

// Admin reports with priority sorting
const prioritySort = (a, b) => {
  const ranks = { High: 3, Medium: 2, Low: 1 };
  const rankA = ranks[a.severity] || 0;
  const rankB = ranks[b.severity] || 0;
  
  if (rankA !== rankB) {
    return rankB - rankA; // Descending: High first
  }
  // Ascending: Oldest first
  return new Date(a.createdAt) - new Date(b.createdAt);
};

app.get('/api/admin/reports', async (req, res) => {
  // Mock auth check
  const token = req.headers.authorization;
  if (!token || token !== 'Bearer ADMIN_TOKEN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.severity) query.severity = req.query.severity;
    
    // We assume duplicateOf is null for primaries (as per Phase 5), but we haven't seeded duplicateOf properly yet.
    // Let's just fetch all based on query for now, or add duplicateOf: null if requested.

    let reports = await Report.find(query);
    
    if (req.query.sort === 'priority') {
      reports = reports.sort(prioritySort);
    } else {
      reports = reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json(reports);
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

app.use('/api/admin/reports', adminRoutes);
app.use('/api/resolve', resolveRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
