"use client";

import { useAuthStore } from "@/store/Auth";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface VoteButtonsProps {
  type: "question" | "answer";
  typeId: string;
  upvotes: number;
  downvotes: number;
  userVote?: "upvoted" | "downvoted" | null;
}

export default function VoteButtons({
  type,
  typeId,
  upvotes,
  downvotes,
  userVote,
}: VoteButtonsProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [currentVote, setCurrentVote] = useState(userVote ?? null);
  const [voteResult, setVoteResult] = useState(upvotes - downvotes);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteStatus: "upvoted" | "downvoted") => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus,
          type,
          typeId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVoteResult(data.data.voteResult);
        setCurrentVote(
          data.message === "Vote Withdrawn" ? null : voteStatus
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote("upvoted")}
        disabled={loading}
        className={`p-1.5 rounded-md transition-colors disabled:opacity-50 ${
          currentVote === "upvoted"
            ? "bg-primary/20 text-primary"
            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        }`}
      >
        <IconArrowUp size={18} />
      </button>

      <span
        className={`text-sm font-bold min-w-[1.5rem] text-center ${
          voteResult > 0
            ? "text-primary"
            : voteResult < 0
            ? "text-destructive"
            : "text-muted-foreground"
        }`}
      >
        {voteResult}
      </span>

      <button
        onClick={() => handleVote("downvoted")}
        disabled={loading}
        className={`p-1.5 rounded-md transition-colors disabled:opacity-50 ${
          currentVote === "downvoted"
            ? "bg-destructive/20 text-destructive"
            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        }`}
      >
        <IconArrowDown size={18} />
      </button>
    </div>
  );
}