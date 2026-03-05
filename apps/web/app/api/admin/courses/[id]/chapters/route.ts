import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const chapters = await prisma.chapter.findMany({
    where: { courseId: id },
    orderBy: { index: "asc" },
  });

  return NextResponse.json({ success: true, data: chapters });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, content, videoId, isFree, duration, index } = body;

  if (!title) {
    return NextResponse.json(
      { success: false, error: "title is required" },
      { status: 400 },
    );
  }

  // Auto-calculate next index if not provided
  let chapterIndex = index;
  if (chapterIndex === undefined) {
    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId: id },
      orderBy: { index: "desc" },
      select: { index: true },
    });
    chapterIndex = (lastChapter?.index ?? 0) + 1;
  }

  const chapter = await prisma.chapter.create({
    data: {
      courseId: id,
      index: chapterIndex,
      title,
      content: content || null,
      videoId: videoId ?? "",
      isFree: isFree ?? false,
      duration: duration ?? 0,
    },
  });

  // Update course totalChapters
  const count = await prisma.chapter.count({ where: { courseId: id } });
  await prisma.course.update({
    where: { id },
    data: { totalChapters: count },
  });

  return NextResponse.json({ success: true, data: chapter }, { status: 201 });
}
