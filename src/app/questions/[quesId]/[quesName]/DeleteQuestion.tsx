"use client";

import { useAuthStore } from "@/store/Auth";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { tablesDB } from "@/models/client/config";
import { storage } from "@/models/client/config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconTrash, IconLoader2 } from "@tabler/icons-react";

export default function DeleteQuestion({ question }: { question: any }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user || user.$id !== question.authorId) return null;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this question? This cannot be undone.")) return;
    setLoading(true);
    try {
      if (question.attachmentId) {
        await storage.deleteFile(questionAttachmentBucket, question.attachmentId).catch(() => {});
      }
      await tablesDB.deleteRow(db, questionCollection, question.$id);
      router.push("/questions");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
    >
      {loading ? <IconLoader2 size={12} className="animate-spin" /> : <IconTrash size={12} />}
      Delete
    </button>
  );
}