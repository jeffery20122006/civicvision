import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import Report from '../models/Report.js';
import { dispatchAlert } from './notifyService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runVerification = async (report, originalImagePath, fixedImagePath, workerId) => {
  const pythonScript = path.join(__dirname, '..', '..', 'ai', 'verify_fix.py');

  exec(`python "${pythonScript}" "${originalImagePath}" "${fixedImagePath}"`, { timeout: 15000 }, async (error, stdout, stderr) => {
    try {
      let result = { passed: false, reason: "Verification script failed to execute." };
      
      if (stdout) {
        try {
          result = JSON.parse(stdout.trim());
        } catch (e) {
          console.error("JSON parse error from python output:", e, stdout);
        }
      }

      if (result.passed) {
        // AI verification passed
        report.statusHistory.push({
          from: report.status, // was 'resolving'
          to: 'resolved',
          by: 'AI Verification System',
          at: new Date()
        });
        report.status = 'resolved';
        await report.save();

        // If this report had duplicates, resolve them too
        await Report.updateMany(
          { duplicateOf: report._id }, 
          { 
            status: 'resolved', 
            $push: { 
              statusHistory: { from: 'pending', to: 'resolved', by: 'System (Primary Fixed)', at: new Date() } 
            } 
          }
        );

        // Notify citizen that the issue was resolved
        dispatchAlert(report, workerId, 'success', `Good news! The issue you reported (${report.detectedIssue}) has been successfully fixed and verified.`);
      } else {
        // AI verification failed
        report.statusHistory.push({
          from: report.status, // was 'resolving'
          to: 'in-progress',
          by: 'AI Verification System (Failed)',
          at: new Date()
        });
        report.status = 'in-progress';
        await report.save();

        // Notify worker why it failed
        dispatchAlert(report, workerId, 'failure', `Task approval failed for report ${report._id}. Reason: ${result.reason}`);
      }
    } catch (err) {
      console.error("Error in verifyService:", err);
      // Fallback on failure
      report.statusHistory.push({
        from: 'resolving',
        to: 'in-progress',
        by: 'AI Verification Error',
        at: new Date()
      });
      report.status = 'in-progress';
      await report.save();
      dispatchAlert(report, workerId, 'failure', `System error during verification.`);
    }
  });
};
