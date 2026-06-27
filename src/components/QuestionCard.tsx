import Link from "next/link";
import {
  IconArrowUp,
  IconArrowDown,
  IconMessage,
  IconClock,
  IconUser,
} from "@tabler/icons-react";
import slugify from "@/lib/slugify";

interface QuestionCardProps {
  question: any;
  voteCount?: number;
  answerCount?: number;
}

export default function QuestionCard({
  question,
  voteCount = 0,
  answerCount = 0,
}: QuestionCardProps) {
  return (
    <div className="group rounded-lg border border-border bg-card hover:border-primary/30 transition-colors p-4">
      <div className="flex gap-4">
        {/* Stats */}
        <div className="flex flex-col items-center gap-2 shrink-0 min-w-[52px]">
          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                voteCount > 0
                  ? "text-primary"
                  : voteCount < 0
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              {voteCount}
            </div>
            <div className="text-[10px] text-muted-foreground">votes</div>
          </div>
          <div className="text-center">
            <div
              className={`text-sm font-semibold ${
                answerCount > 0 ? "text-green-400" : "text-muted-foreground"
              }`}
            >
              {answerCount}
            </div>
            <div className="text-[10px] text-muted-foreground">answers</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/questions/${question.$id}/${slugify(question.title)}`}
            className="text-base font-semibold hover:text-primary transition-colors line-clamp-2"
          >
            {question.title}
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(question.tags || []).map((tag: string) => (
              <span
                key={tag}
                className="rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconUser size={11} />
              <span className="truncate max-w-[100px]">
                {question.authorId?.slice(0, 8) || "Anonymous"}
              </span>
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <IconClock size={11} />
              {new Date(question.$createdAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year:
                  new Date(question.$createdAt).getFullYear() !==
                  new Date().getFullYear()
                    ? "numeric"
                    : undefined,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}