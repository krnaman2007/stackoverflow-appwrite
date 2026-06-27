"use client";

import { useAuthStore } from "@/store/Auth";
import { IconEdit } from "@tabler/icons-react";

export default function EditButton({ userId }: { userId: string }) {
  const { user } = useAuthStore();
  if (!user || user.$id !== userId) return null;

  return (
    <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
      <IconEdit size={12} />
      Edit Profile
    </button>
  );
}