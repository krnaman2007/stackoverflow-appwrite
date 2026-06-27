"use client";

import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { IconEdit } from "@tabler/icons-react";
import slugify from "@/lib/slugify";

export default function EditQuestion({ question }: { question: any }) {
  const { user } = useAuthStore();
  if (!user || user.$id !== question.authorId) return null;

  return (
    <Link
      href={`/questions/${question.$id}/${slugify(question.title)}/edit`}
      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
    >
      <IconEdit size={12} />
      Edit
    </Link>
  );
}