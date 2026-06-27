"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IconLoader2, IconTrash, IconMessageCircle } from "@tabler/icons-react";
import { tablesDB } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { ID } from "appwrite";

interface CommentsProps {
  type: "question" | "answer";
  typeId: string;
  comments: any[];
}

export default function Comments({ type, typeId, comments: initialComments }: CommentsProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!content.trim()) return;

    setLoading(true);
    try {
      const doc = await tablesDB.createRow(db, commentCollection, ID.unique(), {
        content,
        type,
        typeId,
        authorId: user.$id,
      });
      setComments((prev) => [...prev, doc]);
      setContent("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await tablesDB.deleteRow(db, commentCollection, commentId);
      setComments((prev) => prev.filter((c) => c.$id !== commentId));
    } catch {}
  };

  return (
    <div className="mt-3">
      {/* Comments list */}
      {comments.length > 0 && (
        <ul className="space-y-1.5 mb-2 pl-2 border-l-2 border-border">
          {comments.map((comment) => (
            <li key={comment.$id} className="flex items-start gap-2 text-sm py-1">
              <span className="text-muted-foreground leading-relaxed flex-1">
                {comment.content}{" "}
                <span className="text-xs opacity-60">
                  — {comment.authorId?.slice(0, 8)}
                </span>
              </span>
              {user?.$id === comment.authorId && (
                <button
                  onClick={() => handleDelete(comment.$id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <IconTrash size={11} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add comment */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-md border border-border bg-input px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {loading ? <IconLoader2 size={12} className="animate-spin" /> : "Post"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => user ? setShowForm(true) : router.push("/login")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
        >
          <IconMessageCircle size={12} />
          Add comment
        </button>
      )}
    </div>
  );
}