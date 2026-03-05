import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { DeleteCommentButton } from "./delete-button";

export default async function AdminCommentsPage(): Promise<React.JSX.Element> {
  const comments = await prisma.comment.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, nickname: true, avatarUrl: true } },
      parent: {
        select: {
          id: true,
          user: { select: { nickname: true } },
        },
      },
    },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">评论管理</h1>
        <p className="text-sm text-muted-foreground">
          共 {comments.length} 条评论
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        {comments.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            暂无评论
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">用户</th>
                <th className="px-6 py-3 font-medium">内容</th>
                <th className="px-6 py-3 font-medium">评论</th>
                <th className="px-6 py-3 font-medium">时间</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {comments.map((comment) => {
                const contentUrl =
                  comment.contentType === "article"
                    ? `/articles/${comment.contentSlug}`
                    : `/courses/${comment.contentSlug}`;
                const contentLabel =
                  comment.contentType === "article" ? "文章" : "章节";

                return (
                  <tr key={comment.id} className="hover:bg-accent/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {comment.user.avatarUrl ? (
                          <img
                            src={comment.user.avatarUrl}
                            alt=""
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                            {comment.user.nickname.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium">
                          {comment.user.nickname}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={contentUrl}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                      >
                        <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs mr-1">
                          {contentLabel}
                        </span>
                        {comment.contentSlug}
                      </Link>
                      {comment.parent && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          回复 @{comment.parent.user.nickname}
                        </p>
                      )}
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate text-sm">{comment.body}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {comment.createdAt.toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-6 py-4">
                      <DeleteCommentButton commentId={comment.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
