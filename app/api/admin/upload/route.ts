import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { ID } from 'node-appwrite';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;

    if (!file || !bucketId) {
      return NextResponse.json({ error: 'File and Bucket ID are required' }, { status: 400 });
    }

    const { databases, storage } = createAdminClient(); // I'll update lib/appwrite.ts to include storage

    const uploadedFile = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );

    // Construct the public URL (Make sure the bucket has 'Read' permissions for 'Any')
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
