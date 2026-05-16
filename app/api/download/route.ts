import { NextRequest, NextResponse } from 'next/server';
import { downloadVideo } from '@/lib/downloader';
import { checkRateLimit } from '@/lib/rate-limit';
import '@/lib/cleanup'; // Import to ensure cleanup worker starts

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
    }

    const videoInfo = await downloadVideo(url);

    return NextResponse.json({
      success: true,
      ...videoInfo,
      downloadUrl: `/api/files/${videoInfo.filename}`
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
