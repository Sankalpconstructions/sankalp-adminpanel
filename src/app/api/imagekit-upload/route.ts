import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, base64 } = body;
    if (!base64) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
    if (!privateKey) {
      console.error('/api/imagekit-upload missing IMAGEKIT_PRIVATE_KEY');
      return NextResponse.json({ error: 'Missing IMAGEKIT_PRIVATE_KEY on server' }, { status: 500 });
    }

    const mime = (fileName || '').toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';

    const form = new FormData();
    form.append('file', `data:${mime};base64,${base64}`);
    form.append('fileName', fileName || `upload_${Date.now()}`);
    form.append('useUniqueFileName', 'true');

    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${privateKey}:`).toString('base64')
      } as any,
      body: form as any,
    });

    const data = await uploadRes.json();
    if (!uploadRes.ok) {
      console.error('/api/imagekit-upload failed:', data);
      return NextResponse.json({ error: data }, { status: uploadRes.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("/api/imagekit-upload error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
