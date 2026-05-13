import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // ✅ read multipart form data
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
    if (!privateKey) {
      return NextResponse.json(
        { error: "Missing IMAGEKIT_PRIVATE_KEY on server" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadForm = new FormData();
    uploadForm.append("file", buffer as any);
    uploadForm.append("fileName", file.name);
    uploadForm.append("useUniqueFileName", "true");

    const uploadRes = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${privateKey}:`).toString("base64"),
        } as any,
        body: uploadForm as any,
      }
    );

    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      return NextResponse.json({ error: data }, { status: uploadRes.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
