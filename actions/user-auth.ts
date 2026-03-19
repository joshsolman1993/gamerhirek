"use server";

import { login as libLogin, signToken } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function userLoginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Minden kötelező mezőt ki kell tölteni!" };

  const res = await libLogin(email, password);
  if (!res.success) {
    return { error: res.error };
  }

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo && redirectTo !== "null" && redirectTo !== "") {
    redirect(redirectTo);
  } else {
    redirect("/profil");
  }
}

export async function userRegisterAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Minden kötelező mezőt ki kell tölteni!" };
  }
  if (password.length < 6) {
    return { error: "A jelszónak legalább 6 karakter hosszúnak kell lennie!" };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ezzel az e-mail címmel már regisztráltak." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "USER", // Override default "EDITOR" specifically so users don't break the admin panel
    },
  });

  const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/profil");
}

export async function userLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/");
}
