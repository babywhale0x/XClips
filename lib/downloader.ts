import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface VideoInfo {
  id: string;
  title: string;
  filename: string;
  duration?: number;
  thumbnail?: string;
}

const TEMP_DIR = path.join(process.cwd(), '.temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export async function downloadVideo(url: string): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    // Basic URL validation
    const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/[0-9]+(\?.*)?$/;
    if (!twitterRegex.test(url)) {
      return reject(new Error('Invalid X/Twitter URL'));
    }

    // Sanitize URL by removing query params to be safe, though spawn is relatively safe
    const sanitizedUrl = url.split('?')[0];

    // yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" 
    // -o "temp/%(id)s.%(ext)s" --print filename <URL>
    
    // Cookie Handling
    const cookiesPath = path.join(TEMP_DIR, 'cookies.txt');
    if (process.env.TWITTER_COOKIES_B64) {
      try {
        const decodedCookies = Buffer.from(process.env.TWITTER_COOKIES_B64, 'base64').toString('utf-8');
        fs.writeFileSync(cookiesPath, decodedCookies);
      } catch (err) {
        console.error('Failed to write cookies file:', err);
      }
    }

    const localFfmpeg = 'C:\\Users\\ikuda\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe';
    
    const args = [
      '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      '--no-playlist',
      '--max-filesize', '100M',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      '--add-header', 'Referer:https://x.com/',
      '--add-header', 'Origin:https://x.com/',
      ...(fs.existsSync(localFfmpeg) ? ['--ffmpeg-location', localFfmpeg] : []),
      ...(fs.existsSync(cookiesPath) ? ['--cookies', cookiesPath] : []),
      '-o', path.join(TEMP_DIR, '%(id)s.%(ext)s'),
      '--print', 'id',
      '--print', 'title',
      '--print', 'filename',
      '--no-simulate',
      sanitizedUrl
    ];

    const child = spawn('yt-dlp', args);

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('error', (error) => {
      console.error('Spawn error:', error);
      reject(new Error(`System error: Could not start downloader. Ensure yt-dlp is installed. (${error.message})`));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`yt-dlp error: ${errorOutput}`);
        return reject(new Error('Failed to extract video. Make sure the tweet contains a video and is public.'));
      }

      const lines = output.trim().replace(/\r/g, '').split('\n');
      if (lines.length < 3) {
        return reject(new Error('Failed to parse yt-dlp output'));
      }

      const id = lines[0].trim();
      const title = lines[1].trim();

      // Find any file in TEMP_DIR that starts with the ID
      const files = fs.readdirSync(TEMP_DIR);
      const matchedFile = files.find(f => f.startsWith(id));

      if (!matchedFile) {
        console.error(`Extraction succeeded for ID ${id}, but no file starting with this ID was found in ${TEMP_DIR}. Found files: ${files.join(', ')}`);
        return reject(new Error('Extraction succeeded but file was not saved. This usually happens if the video format is not supported or requires FFmpeg.'));
      }

      const filename = matchedFile;
      const fullPath = path.join(TEMP_DIR, filename);

      console.log(`Successfully found extracted file: ${fullPath}`);

      resolve({
        id,
        title,
        filename
      });
    });

    // Timeout after 120 seconds
    setTimeout(() => {
      child.kill();
      reject(new Error('Download timed out after 120 seconds. This might be due to a blocked connection or rate limits.'));
    }, 120000);
  });
}
