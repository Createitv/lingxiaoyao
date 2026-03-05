import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/auth/admin";
import { uploadToCOS } from "@/lib/tencent/cos";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: "Unsupported file type" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, error: "File too large (max 10MB)" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() ?? "jpg";
  const now = new Date();
  const key = `images/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const url = await uploadToCOS(buffer, key, file.type);

  return NextResponse.json({ success: true, data: { url } });
}
