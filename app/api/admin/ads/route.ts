import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, APPWRITE_DB_ID, ADS_COLLECTION_ID } from '@/lib/appwrite';
import { ID, Query } from 'node-appwrite';

export async function GET() {
  const { databases } = createAdminClient();
  
  try {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      ADS_COLLECTION_ID,
      [Query.orderAsc('display_order')]
    );
    return NextResponse.json(response.documents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { image_url, link_url, is_active, display_order } = await req.json();
    const { databases } = createAdminClient();

    const response = await databases.createDocument(
      APPWRITE_DB_ID,
      ADS_COLLECTION_ID,
      ID.unique(),
      { 
        image_url, 
        link_url, 
        is_active: is_active !== undefined ? !!is_active : true, 
        display_order: Number(display_order) || 0 
      }
    );
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { databases } = createAdminClient();

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    await databases.deleteDocument(APPWRITE_DB_ID, ADS_COLLECTION_ID, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, image_url, link_url, is_active } = await req.json();
  const { databases } = createAdminClient();

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const response = await databases.updateDocument(
      APPWRITE_DB_ID,
      ADS_COLLECTION_ID,
      id,
      { image_url, link_url, is_active }
    );
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
