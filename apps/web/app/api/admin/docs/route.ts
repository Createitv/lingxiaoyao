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
  const search = searchParams.get("search") ?? "";

  const where = search
    ? { OR: [{ title: { contains: search } }, { slug: { contains: search } }] }
    : {};

  const [items, total] = await Promise.all([
    prisma.doc.findMany({
      where,
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        sortOrder: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.doc.count({ where }),
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
  const { slug, title, description, content, category, sortOrder, publishedAt } = body;

  if (!slug || !title) {
    return NextResponse.json(
      { success: false, error: "slug and title are required" },
      { status: 400 },
    );
  }

  const doc = await prisma.doc.create({
    data: {
      slug,
      title,
      description: description || null,
      content: content ?? "",
      category: category ?? slug.split("/")[0] ?? slug,
      sortOrder: sortOrder ?? 0,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    },
  });

  return NextResponse.json({ success: true, data: doc }, { status: 201 });
}
