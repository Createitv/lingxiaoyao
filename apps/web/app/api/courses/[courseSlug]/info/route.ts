import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/lib/content/courses";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  const { courseSlug } = await params;
  const course = await getCourseBySlug(courseSlug);

  if (!course) {
    return NextResponse.json(
      { success: false, error: "课程不存在" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      slug: course.slug,
      title: course.title,
      price: course.price,
      totalChapters: course.totalChapters,
    },
  });
}
