import { users } from "@/models/server/config";
import { db, questionCollection, answerCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import { Query } from "node-appwrite";
import { notFound } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";
import EditButton from "./EditButton";
import { IconStar, IconStack2, IconMessage } from "@tabler/icons-react";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
}) {
  const { userId } = await params;
  let userData: any;
  try {
    userData = await users.get(userId);
  } catch {
    notFound();
  }

  const [questions, answers] = await Promise.all([
    tablesDB.listRows(db, questionCollection, [
      Query.equal("authorId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(20),
    ]).catch(() => ({ rows: [], total: 0 })),
    tablesDB.listRows(db, answerCollection, [
      Query.equal("authorId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(20),
    ]).catch(() => ({ rows: [], total: 0 })),
  ]);

  const reputation = userData.prefs?.reputation ?? 0;

  return (
    <div>
      {/* Profile card */}
      <div className="rounded-lg border border-border bg-card p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {userData.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{userData.name}</h1>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm">
                  <IconStar size={14} className="text-primary" />
                  <span className="font-semibold text-primary">{reputation}</span>
                  <span className="text-muted-foreground">reputation</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <IconStack2 size={14} />
                  {questions.total} questions
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <IconMessage size={14} />
                  {answers.total} answers
                </div>
              </div>
            </div>
          </div>
          <EditButton userId={userId} />
        </div>
      </div>

      {/* Questions */}
      {questions.rows.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Questions ({questions.total})</h2>
          <div className="space-y-3">
            {questions.rows.map((q: any) => (
              <QuestionCard key={q.$id} question={q} />
            ))}
          </div>
        </div>
      )}

      {/* Answers */}
      {answers.rows.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Answers ({answers.total})</h2>
          <div className="space-y-3">
            {answers.rows.map((a: any) => (
              <div key={a.$id} className="rounded-lg border border-border bg-card p-4 text-sm text-foreground/80 leading-relaxed">
                <p className="line-clamp-3">{a.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(a.$createdAt).toLocaleDateString("en-IN", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.rows.length === 0 && answers.rows.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No activity yet.
        </div>
      )}
    </div>
  );
}