"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const id = formData.get("id") as string;
  const password = formData.get("password") as string;

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
    redirect("/admin/dashboard");
  }

  return { error: "Invalid ID or Password. Please try again." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("sankalp_admin_session");
  redirect("/admin/login");
}
