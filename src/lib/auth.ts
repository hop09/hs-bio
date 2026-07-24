import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";

const COOKIE_NAME = "hsbio_session";
const sessionDuration = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
}

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Admin credentials are not configured");
  const collection = (await getDatabase()).collection("admins");
  await collection.createIndex({ email: 1 }, { unique: true });
  let admin = await collection.findOne({ email });
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await collection.insertOne({ email, passwordHash, createdAt: new Date(), updatedAt: new Date() });
    admin = { _id: result.insertedId, email, passwordHash };
  }
  return admin;
}

export async function authenticate(email: string, password: string) {
  const admin = await ensureAdmin();
  if (admin.email !== email.trim().toLowerCase() || !(await bcrypt.compare(password, String(admin.passwordHash)))) return false;
  const token = await new SignJWT({ email: admin.email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" }).setSubject(admin._id.toString())
    .setIssuedAt().setExpirationTime(`${sessionDuration}s`).sign(secret());
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: sessionDuration,
  });
  return true;
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, secret())).payload; } catch { return null; }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
  return session;
}

export async function logout() { (await cookies()).delete(COOKIE_NAME); }
