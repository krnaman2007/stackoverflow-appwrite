"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { IconArrowRight, IconCode, IconStack2, IconUsers } from "@tabler/icons-react";

const stats = [
  { label: "Questions Asked", value: "10K+", icon: IconStack2 },
  { label: "Developers", value: "2K+", icon: IconUsers },
  { label: "Answers Given", value: "25K+", icon: IconCode },
];

export default function HeroSection() {
  const { user } = useAuthStore();

  return (
    <section className="relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.96 0.005 240) 1px, transparent 1px), linear-gradient(to right, oklch(0.96 0.005 240) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Developer Q&A Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
          Every bug has a{" "}
          <span className="text-primary">solution.</span>
          <br />
          Find it here.
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          Ask questions, share knowledge, and help fellow developers. Your next
          breakthrough is one question away.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/questions"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse Questions
            <IconArrowRight size={16} />
          </Link>
          {!user && (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-5 py-2.5 text-sm font-semibold hover:bg-secondary/80 transition-colors"
            >
              Join for Free
            </Link>
          )}
          {user && (
            <Link
              href="/questions/ask"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-5 py-2.5 text-sm font-semibold hover:bg-secondary/80 transition-colors"
            >
              Ask a Question
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon size={18} className="text-primary mx-auto mb-1.5 opacity-80" />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}