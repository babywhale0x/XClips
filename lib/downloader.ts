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
 * Helper to fetch video using the fallback twitter-v24 API.
 */
async function fetchWithV24(url: string, apiKey: string): Promise<{ videoUrl: string, title: string, id: string }> {
  const match = url.match(/(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/i);
  if (!match) throw new Error("Could not parse tweet URL for v24 fallback");
  const username = match[1];
  const tweetId = match[2];

  // 1. Get user_id
  const userRes = await fetch(`https://twitter-v24.p.rapidapi.com/user/about?username=${username}`, {
    headers: { 'x-rapidapi-host': 'twitter-v24.p.rapidapi.com', 'x-rapidapi-key': apiKey }
  });
  if (!userRes.ok) throw new Error(`v24 about failed: ${userRes.status}`);
  const userData = await userRes.json();
  const userId = userData?.data?.user_result_by_screen_name?.result?.rest_id;
  if (!userId) throw new Error("Could not find user ID from v24");

  // 2. Get user media
  const mediaRes = await fetch(`https://twitter-v24.p.rapidapi.com/user/media?user_id=${userId}&limit=40`, {
    headers: { 'x-rapidapi-host': 'twitter-v24.p.rapidapi.com', 'x-rapidapi-key': apiKey }
  });
  if (!mediaRes.ok) throw new Error(`v24 media failed: ${mediaRes.status}`);
  const mediaData = await mediaRes.json();

  // 3. Parse timeline to find tweetId
  const instructions = mediaData?.data?.user?.result?.timeline_v2?.timeline?.instructions || [];
  let videoUrl = '';
  let title = 'Video';

  for (const inst of instructions) {
    if (inst.type === 'TimelineAddEntries' && inst.entries) {
      for (const entry of inst.entries) {
        if (entry.content?.items) {
          for (const item of entry.content.items) {
            const tweet = item.item?.itemContent?.tweet_results?.result;
            if (tweet && tweet.rest_id === tweetId) {
               title = tweet.legacy?.full_text || 'Video';
               const mediaList = tweet.legacy?.extended_entities?.media || tweet.legacy?.entities?.media || [];
               for (const m of mediaList) {
                  if (m.type === 'video' || m.type === 'animated_gif') {
                     const variants = m.video_info?.variants || [];
                     const sorted = [...variants].filter(v => v.content_type === 'video/mp4').sort((a,b) => (b.bitrate || 0) - (a.bitrate || 0));
                     if (sorted.length > 0) {
                        videoUrl = sorted[0].url;
                        break;
                     }
                  }
               }
            }
          }
        }
      }
    }
  }

  if (!videoUrl) throw new Error("Could not find video in v24 media feed");
  
  return { videoUrl, title, id: tweetId };
}

/**
 * API strategies for different RapidAPI video downloaders.
 */
type ApiStrategy = {
  name: string;
  supports: (url: string) => boolean;
  execute: (url: string, apiKey: string) => Promise<{ videoUrl: string, title: string, id: string }>;
};

const strategies: ApiStrategy[] = [
  {
    name: 'all-in-one-lite',
    supports: () => true, // generic downloader
    execute: async (url, apiKey) => {
       const res = await fetch(`https://download-all-in-one-lite.p.rapidapi.com/autolink?url=${encodeURIComponent(url)}`, {
          headers: { 'x-rapidapi-host': 'download-all-in-one-lite.p.rapidapi.com', 'x-rapidapi-key': apiKey }
       });
       if (!res.ok) throw new Error(`Status: ${res.status}`);
       const data = await res.json();
       if (data.error) throw new Error('API returned error: ' + data.error);
       
       const medias = data.medias || [];
       const video = medias.find((m: any) => m.type === 'video' && m.quality === 'hd_no_watermark') 
                  || medias.find((m: any) => m.type === 'video');
       if (!video || !video.url) throw new Error('No video found in response');
       return { videoUrl: video.url, title: data.title || 'Video', id: data.id || Date.now().toString() };
    }
  },
  {
    name: 'all-in-one-ultimate',
    supports: () => true, // generic downloader
    execute: async (url, apiKey) => {
       const res = await fetch(`https://download-all-in-one-ultimate.p.rapidapi.com/autolink?url=${encodeURIComponent(url)}`, {
          headers: { 'x-rapidapi-host': 'download-all-in-one-ultimate.p.rapidapi.com', 'x-rapidapi-key': apiKey }
       });
       if (!res.ok) throw new Error(`Status: ${res.status}`);
       const data = await res.json();
       if (data.error) throw new Error('API returned error: ' + data.error);
       
       const medias = data.medias || [];
       const video = medias.find((m: any) => m.type === 'video' && m.quality === 'hd_no_watermark') 
                  || medias.find((m: any) => m.type === 'video');
       if (!video || !video.url) throw new Error('No video found in response');
       return { videoUrl: video.url, title: data.title || 'Video', id: data.id || Date.now().toString() };
    }
  },
  {
    name: 'twitter-x-video-downloader1',
    supports: (url) => /(?:x\.com|twitter\.com)/i.test(url),
    execute: async (url, apiKey) => {
      const res = await fetch(`https://twitter-x-video-downloader1.p.rapidapi.com/api/download/twitter?url=${encodeURIComponent(url)}`, {
        headers: { 'x-rapidapi-host': 'twitter-x-video-downloader1.p.rapidapi.com', 'x-rapidapi-key': apiKey }
      });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      if (data.status !== 'success' || !data.result) throw new Error('Unsuccessful status');
      
      const mediaArr = data.result.media || [];
      let videoUrl = '';
      for (const m of mediaArr) {
        if (m.type === 'video' && m.videos && m.videos.length > 0) {
          const sortedVideos = [...m.videos].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
          videoUrl = sortedVideos[0].url;
          break;
        }
      }
      if (!videoUrl) throw new Error('No video found in response');
      return { videoUrl, title: data.result.description || 'Video', id: data.result.id || Date.now().toString() };
    }
  },
  {
    name: 'twitter-v24',
    supports: (url) => /(?:x\.com|twitter\.com)/i.test(url),
    execute: async (url, apiKey) => {
      return await fetchWithV24(url, apiKey);
    }
  }
];

/**
 * Downloads a video using RapidAPI endpoints with automatic fallback and key rotation.
 */
export async function downloadVideo(url: string): Promise<VideoInfo> {
  if (!url) {
    throw new Error('URL is required');
  }

  const keysStr = process.env.RAPID_API_KEYS || process.env.RAPID_API_KEY || 'e4bc1e2e31mshc4ceaa07642b5a9p1ab2dejsn34db64ff6b54';
  const apiKeys = keysStr.split(',').map(k => k.trim()).filter(k => k.length > 0);

  let lastError: Error | null = null;
  let videoUrl = '';
  let id = '';
  let title = 'Video';

  const applicableStrategies = strategies.filter(s => s.supports(url));
  let success = false;

  for (const strategy of applicableStrategies) {
    if (success) break;
    for (const apiKey of apiKeys) {
      try {
        console.log(`Attempting ${strategy.name} with key ${apiKey.substring(0,5)}...`);
        const result = await strategy.execute(url, apiKey);
        videoUrl = result.videoUrl;
        title = result.title;
        id = result.id;
        success = true;
        break; // break out of key loop on success
      } catch (err: any) {
         console.error(`${strategy.name} failed on key ${apiKey.substring(0,5)}: ${err.message}`);
         lastError = err;
      }
    }
  }

  if (!success || !videoUrl) {
    throw lastError || new Error('Failed to obtain a response from any API using any of the provided keys.');
  }

  // --- DOWNLOAD THE FILE ---
  const videoRes = await fetch(videoUrl);
  if (!videoRes.ok) {
    throw new Error(`Failed to fetch video file from downloader: ${videoRes.status}`);
  }

  const buffer = Buffer.from(await videoRes.arrayBuffer());
  const filename = `${id}.mp4`;
  fs.writeFileSync(path.join(TEMP_DIR, filename), buffer);

  // truncate title to 50 chars if needed
  if (title.length > 50) {
    title = title.substring(0, 50).trim() + '...';
  }

  return { id, title, filename };
}

