import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), '.temp', filename);

  // Security: Prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found or expired' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const response = new NextResponse(fileBuffer);

  const ext = path.extname(filename).toLowerCase();
  const contentType = ext === '.webm' ? 'video/webm' : 'video/mp4';

  response.headers.set('Content-Type', contentType);
  response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);

  return response;
}
