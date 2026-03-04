import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "管理后台 | 林逍遥 AI",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="ml-60 min-h-screen">
          <div className="border-b bg-card">
            <div className="flex h-14 items-center justify-between px-6">
              <div />
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {admin.nickname}
                </span>
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  {admin.nickname.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
