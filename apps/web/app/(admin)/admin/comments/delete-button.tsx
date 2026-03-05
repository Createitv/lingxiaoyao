"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCommentButton({ commentId }: { commentId: string }): React.JSX.Element {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("确定要删除这条评论吗？")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm text-destructive hover:underline disabled:opacity-50"
    >
      {isDeleting ? "删除中..." : "删除"}
    </button>
  );
}
