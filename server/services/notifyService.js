import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock notifications store
const NOTIFICATIONS_FILE = path.join(__dirname, '..', 'uploads', 'notifications.json');

export const dispatchAlert = (report, workerId, type, message) => {
  try {
    let notifications = [];
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const fileData = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      notifications = JSON.parse(fileData);
    }

    const newNotification = {
      id: `evt_${Date.now()}`,
      dispatchContact: 'citizen@example.com', // mock email
      payload: {
        reportId: report._id,
        workerId: workerId,
        type: type, // 'success' or 'failure'
        message: message,
      },
      dateSent: new Date().toISOString()
    };

    notifications.push(newNotification);

    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    console.log(`[NOTIFY] Alert dispatched: ${message}`);
  } catch (error) {
    console.error('Error dispatching notification:', error);
  }
};
