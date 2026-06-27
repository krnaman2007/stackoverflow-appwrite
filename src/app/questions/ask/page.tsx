import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import QuestionForm from "@/components/QuestionForm";

export default function AskPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Ask a Question</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Be specific and clear. Good questions get great answers faster.
          </p>
        </div>
        <QuestionForm />
      </main>
      <Footer />
    </>
  );
}