"use client";

import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconCode,
  IconSearch,
  IconBell,
  IconMenu2,
  IconX,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconPlus,
} from "@tabler/icons-react";

export default function Header() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/questions", label: "Questions" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <IconCode size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Stack<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 mx-8 max-w-md">
            <Link
              href="/questions"
              className="flex w-full items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/50 transition-colors"
            >
              <IconSearch size={14} />
              <span>Search questions...</span>
              <span className="ml-auto text-xs opacity-50">⌘K</span>
            </Link>
          </div>

          {/* Nav + auth */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/questions/ask"
                  className="ml-2 flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <IconPlus size={14} />
                  Ask
                </Link>

                {/* Profile dropdown */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <IconChevronDown size={14} className="text-muted-foreground" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-1 w-48 rounded-md border border-border bg-card shadow-lg py-1">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        href={`/users/${user.$id}/${user.name?.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <IconUser size={14} />
                        Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <IconLogout size={14} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/questions/ask"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  + Ask Question
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground text-center hover:bg-primary/90 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}