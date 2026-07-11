import { db, questionCollection, voteCollection, answerCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import { Query } from "node-appwrite";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import QuestionCard from "@/components/QuestionCard";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import Search from "./Search";
import { IconPlus } from "@tabler/icons-react";

const LIMIT = 10;

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedSearchParams.page || "1"));
  const search = resolvedSearchParams.search?.trim() || "";

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.limit(LIMIT),
    Query.offset((page - 1) * LIMIT),
  ];

  if (search) {
    queries.push(Query.or([
      Query.search("title", search),
      Query.search("content", search),
    ]));
  }

  let questions = { rows: [] as any[], total: 0 };
  try {
    questions = await tablesDB.listRows(db, questionCollection, queries);
  } catch {}

  // Fetch vote counts and answer counts for each question
  const enriched = await Promise.all(
    questions.rows.map(async (q: any) => {
      const [votes, answers] = await Promise.all([
        tablesDB.listRows(db, voteCollection, [Query.equal("typeId", q.$id), Query.equal("type", "question")]).catch(() => ({ rows: [] })),
        tablesDB.listRows(db, answerCollection, [Query.equal("questionId", q.$id)]).catch(() => ({ rows: [] })),
      ]);
      const upvotes = votes.rows.filter((v: any) => v.voteStatus === "upvoted").length;
      const downvotes = votes.rows.filter((v: any) => v.voteStatus === "downvoted").length;
      return { ...q, voteCount: upvotes - downvotes, answerCount: answers.rows.length };
    })
  );

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Questions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {questions.total.toLocaleString()} question{questions.total !== 1 ? "s" : ""}
              {search ? ` matching "${search}"` : ""}
            </p>
          </div>
          <Link
            href="/questions/ask"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <IconPlus size={15} />
            Ask Question
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Suspense>
            <Search />
          </Suspense>
        </div>

        {/* Questions list */}
        {enriched.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground mb-3">
              {search ? `No questions found for "${search}"` : "No questions yet."}
            </p>
            <Link
              href="/questions/ask"
              className="text-sm text-primary hover:underline"
            >
              Ask the first question →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enriched.map((q) => (
              <QuestionCard
                key={q.$id}
                question={q}
                voteCount={q.voteCount}
                answerCount={q.answerCount}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {questions.total > LIMIT && (
          <div className="mt-8">
            <Suspense>
              <Pagination total={questions.total} limit={LIMIT} />
            </Suspense>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}