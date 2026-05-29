import type { SessionPayload } from "@/types";

const encoder = new TextEncoder();
const defaultCookieName = "catering_session";
const sessionMaxAge = 60 * 60 * 24 * 7;

export const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? defaultCookieName;
export const staleSessionCookieNames = [
  defaultCookieName,
  "session",
  "user_session",
  "admin_session",
  "sb-access-token",
  "sb-refresh-token",
].filter((name, index, all) => all.indexOf(name) === index && name !== sessionCookieName);

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 24) {
    throw new Error("SESSION_SECRET must be at least 24 characters long.");
  }

  return secret;
}

function base64UrlEncode(input: string | ArrayBuffer) {
  const bytes = typeof input === "string" ? encoder.encode(input) : new Uint8Array(input);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(input: string) {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

async function importSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(value: string) {
  const key = await importSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return base64UrlEncode(signature);
}

export async function createSessionToken(payload: SessionPayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await sign(encodedPayload);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;

    if (!payload.expiresAt || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createSession(payload: Omit<SessionPayload, "expiresAt">) {
  const { cookies } = await import("next/headers");
  const token = await createSessionToken({
    ...payload,
    expiresAt: Date.now() + sessionMaxAge * 1000,
  });

  const cookieStore = await cookies();

  staleSessionCookieNames.forEach((name) => {
    cookieStore.delete(name);
  });

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
}

export async function getSession() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  return verifySessionToken(token);
}

export async function deleteSession() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  cookieStore.delete(sessionCookieName);
  staleSessionCookieNames.forEach((name) => {
    cookieStore.delete(name);
  });
}
