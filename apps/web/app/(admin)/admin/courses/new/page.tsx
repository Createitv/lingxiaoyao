import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">新建课程</h1>
      <CourseForm />
    </div>
  );
}
