"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Questions", key: "questions" },
  { label: "Answers", key: "answers" },
];

export default function UserNavbar({ userId, userSlug }: { userId: string; userSlug: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-border mb-6">
      {tabs.map((tab) => {
        const href = `/users/${userId}/${userSlug}?tab=${tab.key}`;
        const isActive = pathname.includes(userId) && (
          pathname.endsWith(userSlug) ? tab.key === "questions" : false
        );
        return (
          <Link
            key={tab.key}
            href={href}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}