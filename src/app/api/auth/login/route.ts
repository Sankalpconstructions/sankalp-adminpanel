import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();

    const envId = process.env.ADMIN_ID;
    const envPass = process.env.ADMIN_PASSWORD;

    if (id === envId && password === envPass) {
      const cookieStore = await cookies();
      cookieStore.set("sankalp_admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid ID or Password. Please try again." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
