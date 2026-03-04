import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? "20"));

  const [items, total] = await Promise.all([
    prisma.course.findMany({
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { chapters: true } } },
    }),
    prisma.course.count(),
  ]);

  return NextResponse.json({
    success: true,
    data: { items, total, page, pageSize, hasMore: page * pageSize < total },
  });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, title, description, content, price, coverUrl, publishedAt } = body;

  if (!slug || !title) {
    return NextResponse.json(
      { success: false, error: "slug and title are required" },
      { status: 400 },
    );
  }

  const course = await prisma.course.create({
    data: {
      slug,
      title,
      description: description ?? "",
      content: content || null,
      price: price ?? 0,
      coverUrl: coverUrl || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    },
  });

  return NextResponse.json({ success: true, data: course }, { status: 201 });
}
