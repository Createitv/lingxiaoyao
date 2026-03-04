import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { chapterId } = await params;
  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: chapter });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { chapterId } = await params;
  const body = await req.json();
  const { title, content, videoId, isFree, duration, index } = body;

  const chapter = await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content: content || null }),
      ...(videoId !== undefined && { videoId }),
      ...(isFree !== undefined && { isFree }),
      ...(duration !== undefined && { duration }),
      ...(index !== undefined && { index }),
    },
    include: { course: { select: { slug: true } } },
  });

  revalidatePath(`/courses/${chapter.course.slug}`);
  revalidatePath(`/courses/${chapter.course.slug}/${chapter.index}`);

  return NextResponse.json({ success: true, data: chapter });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id, chapterId } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: { select: { slug: true } } },
  });
  await prisma.chapter.delete({ where: { id: chapterId } });

  // Update course totalChapters
  const count = await prisma.chapter.count({ where: { courseId: id } });
  await prisma.course.update({
    where: { id },
    data: { totalChapters: count },
  });

  if (chapter) {
    revalidatePath(`/courses/${chapter.course.slug}`);
  }

  return NextResponse.json({ success: true });
}
