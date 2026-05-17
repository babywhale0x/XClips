import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, APPWRITE_DB_ID, ANALYTICS_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'node-appwrite';

export async function POST(req: NextRequest) {
  try {
    const { event_type, metadata } = await req.json();
    const { databases } = createAdminClient();

    // Try to get country from headers
    const country = req.headers.get('x-vercel-ip-country') || 
                    req.headers.get('cf-ipcountry') || 
                    'Unknown';

    await databases.createDocument(
      APPWRITE_DB_ID,
      ANALYTICS_COLLECTION_ID,
      ID.unique(),
      { 
        event_type, 
        country255: country, 
        metadata: metadata ? JSON.stringify(metadata) : '{}' 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Appwrite Analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
