import { NextRequest, NextResponse } from 'next/server';
import { downloadVideo } from '@/lib/downloader';
import { checkRateLimit } from '@/lib/rate-limit';
import '@/lib/cleanup'; // Import to ensure cleanup worker starts

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
    }

    const videoInfo = await downloadVideo(url);
    if (!videoInfo) {
      console.error('downloadVideo returned undefined');
      return NextResponse.json({ error: 'Failed to retrieve video info' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ...videoInfo,
      downloadUrl: `/api/files/${videoInfo.filename}`,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    const message = error?.message || 'Something went wrong';
    if (message.includes('RapidAPI service unavailable')) {
      return NextResponse.json({ error: message }, { status: 502 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
