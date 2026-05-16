import fs from 'fs';
import path from 'path';

const TEMP_DIR = path.join(process.cwd(), '.temp');
const MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export function cleanupOldFiles() {
  if (!fs.existsSync(TEMP_DIR)) return;

  fs.readdir(TEMP_DIR, (err, files) => {
    if (err) {
      console.error('Error reading temp directory:', err);
      return;
    }

    const now = Date.now();

    files.forEach((file) => {
      const filePath = path.join(TEMP_DIR, file);
      
      // Don't delete hidden files like .gitignore if it exists
      if (file.startsWith('.')) return;

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for ${file}:`, err);
          return;
        }

        if (now - stats.mtimeMs > MAX_AGE_MS) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${file}:`, err);
            } else {
              console.log(`Deleted old temporary file: ${file}`);
            }
          });
        }
      });
    });
  });
}

// Start cleanup interval
if (typeof setInterval !== 'undefined') {
  // Run every 5 minutes
  setInterval(cleanupOldFiles, 5 * 60 * 1000);
  console.log('Temporary file cleanup worker started.');
}
