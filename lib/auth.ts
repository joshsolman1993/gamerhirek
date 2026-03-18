import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "gamerhirek-super-secret-key-2026-valorant"
);

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { success: false, error: "Hibás e-mail vagy jelszó." };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { success: false, error: "Hibás e-mail vagy jelszó." };

  const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
