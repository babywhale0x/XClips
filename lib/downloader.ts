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
  // Basic URL validation
  const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/[0-9]+(\?.*)?$/;
  if (!twitterRegex.test(url)) {
    throw new Error('Invalid X/Twitter URL');
  }

  // Extract Tweet ID
  const match = url.match(/\/status\/(\d+)/);
  if (!match) {
    throw new Error('Failed to extract Tweet ID from URL');
  }
  const tweetId = match[1];

  const apiKey = process.env.RAPID_API_KEY || 'e4bc1e2e31mshc4ceaa07642b5a9p1ab2dejsn34db64ff6b54';

  try {
    // 1. Fetch tweet details from RapidAPI
    const apiRes = await fetch(`https://twitter154.p.rapidapi.com/tweet/details?tweet_id=${tweetId}`, {
      headers: {
        'x-rapidapi-host': 'twitter154.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
    });

    if (!apiRes.ok) {
      throw new Error(`RapidAPI responded with status: ${apiRes.status}`);
    }

    const data = await apiRes.json();
    if (!data || data.detail) {
      throw new Error(data.detail || 'Tweet not found or private');
    }

    // 2. Extract highest quality MP4 video URL
    if (!data.video_url || !Array.isArray(data.video_url)) {
      throw new Error('No video found in this tweet');
    }

    const mp4Videos = data.video_url
      .filter((v: any) => v.content_type === 'video/mp4' && v.url)
      .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));

    if (mp4Videos.length === 0) {
      throw new Error('No MP4 video found in this tweet');
    }

    const videoUrl = mp4Videos[0].url;

    // 3. Download the video file to the temp directory
    const videoRes = await fetch(videoUrl);
    if (!videoRes.ok) {
      throw new Error(`Failed to fetch video file from Twitter: ${videoRes.status}`);
    }

    const buffer = Buffer.from(await videoRes.arrayBuffer());
    const filename = `${tweetId}.mp4`;
    fs.writeFileSync(path.join(TEMP_DIR, filename), buffer);

    const title = data.text ? data.text.split('http')[0].trim() : 'Twitter Video';

    return {
      id: tweetId,
      title: title || 'Twitter Video',
      filename,
    };
  } catch (error: any) {
    console.error('Download error:', error);
    throw new Error(`Download failed: ${error.message || error}`);
  }
}
