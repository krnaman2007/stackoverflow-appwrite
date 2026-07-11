"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import VoteButtons from "./VoteButtons";
import { IconLoader2, IconTrash, IconUser } from "@tabler/icons-react";
import RTE from "./RTE";

interface AnswersProps {
  questionId: string;
  answers: any[];
  currentUserId?: string;
}

export default function Answers({ questionId, answers: initialAnswers, currentUserId }: AnswersProps) {
  const { user, jwt } = useAuthStore();
  const router = useRouter();
  const [answers, setAnswers] = useState(initialAnswers);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!content.trim()) { setError("Answer cannot be empty."); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer: content, authorId: user.$id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post answer");
      setAnswers((prev) => [...prev, data]);
      setContent("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (answerId: string) => {
    if (!confirm("Delete this answer?")) return;
    try {
      const res = await fetch("/api/answer", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerId }),
      });
      if (res.ok) {
        setAnswers((prev) => prev.filter((a) => a.$id !== answerId));
      }
    } catch {}
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">
        {answers.length} Answer{answers.length !== 1 ? "s" : ""}
      </h2>

      {/* Answer list */}
      <div className="space-y-4 mb-8">
        {answers.map((answer) => (
          <div key={answer.$id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex gap-4">
              <VoteButtons
                type="answer"
                typeId={answer.$id}
                upvotes={0}
                downvotes={0}
                votes={[]}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
                  {answer.content}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <IconUser size={11} />
                    <span>{answer.authorId?.slice(0, 8) || "Anonymous"}</span>
                    <span className="mx-1">·</span>
                    <span>
                      {new Date(answer.$createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {(user?.$id === answer.authorId || user?.$id === currentUserId) && (
                    <button
                      onClick={() => handleDelete(answer.$id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <IconTrash size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {answers.length === 0 && (
          <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            No answers yet. Be the first to answer!
          </div>
        )}
      </div>

      {/* Answer form */}
      {user ? (
        <div>
          <h3 className="text-base font-semibold mb-3">Your Answer</h3>
          {error && (
            <p className="text-sm text-destructive mb-2">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <RTE
              value={content}
              onChange={setContent}
              placeholder="Write a detailed, helpful answer..."
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading && <IconLoader2 size={14} className="animate-spin" />}
              Post Answer
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card px-6 py-5 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            You must be logged in to post an answer.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Log in to Answer
          </a>
        </div>
      )}
    </div>
  );
}