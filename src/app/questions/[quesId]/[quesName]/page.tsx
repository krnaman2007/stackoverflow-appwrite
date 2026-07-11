import { answerCollection, commentCollection, db, questionCollection, voteCollection, questionAttachmentBucket } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import { Query } from "node-appwrite";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import VoteButtons from "@/components/VoteButtons";
import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { IconClock, IconUser, IconTag } from "@tabler/icons-react";
import env from "@/app/env";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ quesId: string; quesName: string }>;
}) {
  const { quesId } = await params;
  let question: any;
  try {
    question = await tablesDB.getRow(db, questionCollection, quesId);
  } catch {
    notFound();
  }

  const [votes, answers, comments] = await Promise.all([
    tablesDB.listRows(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
    ]).catch(() => ({ rows: [], total: 0 })),
    tablesDB.listRows(db, answerCollection, [
      Query.equal("questionId", quesId),
      Query.orderAsc("$createdAt"),
    ]).catch(() => ({ rows: [], total: 0 })),
    tablesDB.listRows(db, commentCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
    ]).catch(() => ({ rows: [], total: 0 })),
  ]);

  // Enrich answers with upvotes/downvotes and client-facing vote history
  const enrichedAnswers = await Promise.all(
    answers.rows.map(async (answer: any) => {
      const answerVotes = await tablesDB.listRows(db, voteCollection, [
        Query.equal("typeId", answer.$id),
        Query.equal("type", "answer"),
      ]).catch(() => ({ rows: [], total: 0 }));

      const upvotes = answerVotes.rows.filter((v: any) => v.voteStatus === "upvoted").length;
      const downvotes = answerVotes.rows.filter((v: any) => v.voteStatus === "downvoted").length;

      return {
        ...answer,
        upvotes,
        downvotes,
        votes: answerVotes.rows,
      };
    })
  );

  const upvotes = votes.rows.filter((v: any) => v.voteStatus === "upvoted").length;
  const downvotes = votes.rows.filter((v: any) => v.voteStatus === "downvoted").length;

  // Attachment preview URL
  let attachmentUrl: string | null = null;
  if (question.attachmentId) {
    try {
      attachmentUrl = `${env.appwrite.endpoint}/storage/buckets/${questionAttachmentBucket}/files/${question.attachmentId}/view?project=${env.appwrite.projectId}`;
    } catch {}
  }

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="max-w-3xl mx-auto">
          {/* Question header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold leading-snug">{question.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <EditQuestion question={question} />
                <DeleteQuestion question={question} />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconUser size={11} />
                {question.authorId?.slice(0, 8) || "Anonymous"}
              </span>
              <span className="flex items-center gap-1">
                <IconClock size={11} />
                {new Date(question.$createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Question body */}
          <div className="rounded-lg border border-border bg-card p-5 mb-4">
            <div className="flex gap-5">
              <div className="shrink-0">
                <VoteButtons
                  type="question"
                  typeId={quesId}
                  upvotes={upvotes}
                  downvotes={downvotes}
                  votes={votes.rows}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                  {question.content}
                </div>

                {/* Attachment */}
                {attachmentUrl && (
                  <div className="mt-4">
                    <img
                      src={attachmentUrl}
                      alt="Question attachment"
                      className="rounded-md max-h-80 object-contain border border-border"
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
                  {(question.tags || []).map((tag: string) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-0.5 text-xs text-primary border border-primary/20"
                    >
                      <IconTag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments on question */}
            <div className="mt-4 pl-14">
              <Comments
                type="question"
                typeId={quesId}
                comments={comments.rows}
              />
            </div>
          </div>

          {/* Answers */}
          <Answers
            questionId={quesId}
            answers={enrichedAnswers}
            currentUserId={question.authorId}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}