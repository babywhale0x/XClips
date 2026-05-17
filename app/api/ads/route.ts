import { NextResponse } from 'next/server';
import { createAdminClient, APPWRITE_DB_ID, ADS_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'node-appwrite';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { databases } = createAdminClient();

  try {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      ADS_COLLECTION_ID,
      [
        Query.equal('is_active', true),
        Query.orderAsc('display_order')
      ]
    );

    const ads = response.documents.map(doc => ({
      $id: doc.$id,
      image_url: doc.image_url,
      link_url: doc.link_url
    }));

    return NextResponse.json(ads);
  } catch (error: any) {
    return NextResponse.json([], { status: 200 }); // Return empty array instead of 500 to keep UI stable
  }
}
