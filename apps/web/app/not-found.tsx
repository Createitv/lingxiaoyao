import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export const metadata: Metadata = {
  title: "页面未找到",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        页面不存在，可能已被移动或删除。
      </p>
      <Button asChild className="mt-8 rounded-full px-8" size="lg">
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
