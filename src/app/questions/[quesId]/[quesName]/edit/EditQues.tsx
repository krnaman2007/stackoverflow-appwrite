"use client";

import QuestionForm from "@/components/QuestionForm";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function EditQues({ question }: { question: any }) {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
        <QuestionForm question={question} />
      </main>
      <Footer />
    </>
  );
}