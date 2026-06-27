import Link from "next/link";
import { IconCode, IconBrandGithub, IconHeart } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <IconCode size={13} className="text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">
              Stack<span className="text-primary">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/questions" className="hover:text-foreground transition-colors">
              Questions
            </Link>
            <Link href="/users" className="hover:text-foreground transition-colors">
              Users
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Built with</span>
            <IconHeart size={12} className="text-destructive fill-destructive" />
            <span>using Next.js & Appwrite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}