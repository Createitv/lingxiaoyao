import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/auth/admin";
import crypto from "crypto";

/**
 * Generate a Tencent VOD client-side upload signature.
 * The admin front-end uses this signature with the VOD JS SDK
 * to upload videos directly to Tencent Cloud VOD.
 *
 * Docs: https://cloud.tencent.com/document/product/266/9221
 */
export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const secretId = process.env.TENCENT_SECRET_ID!;
  const secretKey = process.env.TENCENT_SECRET_KEY!;
  const vodAppId = process.env.TENCENT_VOD_APP_ID!;

  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = currentTime + 86400; // 24 hours
  const random = Math.floor(Math.random() * 4294967295);

  const original = [
    `secretId=${secretId}`,
    `currentTimeStamp=${currentTime}`,
    `expireTime=${expireTime}`,
    `random=${random}`,
    `vodSubAppId=${vodAppId}`,
  ].join("&");

  const hmac = crypto.createHmac("sha1", secretKey).update(original).digest();
  const originalBuffer = Buffer.from(original);
  const signBuffer = Buffer.concat([hmac, originalBuffer]);
  const signature = signBuffer.toString("base64");

  return NextResponse.json({
    success: true,
    data: { signature, appId: vodAppId },
  });
}
