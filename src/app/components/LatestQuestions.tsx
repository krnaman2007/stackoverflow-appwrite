import { db, questionCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import Link from "next/link";
import { IconMessage, IconArrowUp, IconArrowRight, IconClock } from "@tabler/icons-react";
import { Query } from "node-appwrite";
import slugify from "@/lib/slugify";

export default async function LatestQuestions() {
  let questions = { rows: [] as any[], total: 0 };

  try {
    questions = await tablesDB.listRows(db, questionCollection, [
      Query.orderDesc("$createdAt"),
      Query.limit(5),
    ]);
  } catch {
    // DB not ready yet
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold">Latest Questions</h2>
        <Link
          href="/questions"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View all <IconArrowRight size={12} />
        </Link>
      </div>

      {questions.rows.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No questions yet. Be the first to{" "}
          <Link href="/questions/ask" className="text-primary hover:underline">
            ask one!
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {questions.rows.map((q: any) => (
            <li key={q.$id} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
              <Link href={`/questions/${q.$id}/${slugify(q.title)}`} className="block">
                <p className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors">
                  {q.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap">
                    {(q.tags || []).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <IconClock size={11} />
                    {new Date(q.$createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}