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

/**
 * Downloads a video via the All Media Downloader RapidAPI endpoint.
 * Returns a VideoInfo object containing a unique ID, title and the saved filename.
 */
export async function downloadVideo(url: string): Promise<VideoInfo> {
  if (!url) {
    throw new Error('URL is required');
  }

  const apiKey = process.env.RAPID_API_KEY || 'e4bc1e2e31mshc4ceaa07642b5a9p1ab2dejsn34db64ff6b54';

  const form = new URLSearchParams();
  form.append('url', url);
  form.append('cookies', '');
  form.append('cookies_file', '');

  const apiRes = await fetch('https://all-media-downloader1.p.rapidapi.com/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-rapidapi-host': 'all-media-downloader1.p.rapidapi.com',
      'x-rapidapi-key': apiKey,
    },
    body: form.toString(),
  });

  if (!apiRes.ok) {
    throw new Error(`All Media Downloader responded with status: ${apiRes.status}`);
  }

  const data = await apiRes.json();
  const videoUrl = data.download_url || data.url || data.video_url;
  if (!videoUrl) {
    throw new Error('No video URL returned from All Media Downloader');
  }

  const id = Date.now().toString();
  const videoRes = await fetch(videoUrl);
  if (!videoRes.ok) {
    throw new Error(`Failed to fetch video file from downloader: ${videoRes.status}`);
  }

  const buffer = Buffer.from(await videoRes.arrayBuffer());
  const filename = `${id}.mp4`;
  fs.writeFileSync(path.join(TEMP_DIR, filename), buffer);

  const title = data.title || data.filename || 'Video';

  return {
    id,
    title,
    filename,
  };
}
