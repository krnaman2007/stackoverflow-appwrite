import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import Link from "next/link";
import { IconTrophy, IconMedal } from "@tabler/icons-react";
import slugify from "@/lib/slugify";

export default async function TopContributers() {
  let topUsers: any[] = [];

  try {
    const response = await users.list();
    topUsers = response.users
      .filter((u) => u.prefs?.reputation > 0)
      .sort((a, b) => (b.prefs?.reputation ?? 0) - (a.prefs?.reputation ?? 0))
      .slice(0, 5);
  } catch {
    // DB not ready
  }

  const medalColors = ["text-yellow-400", "text-gray-400", "text-amber-600"];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <IconTrophy size={15} className="text-primary" />
        <h2 className="text-sm font-semibold">Top Contributors</h2>
      </div>

      {topUsers.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
          No contributors yet. Start answering questions to earn reputation!
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {topUsers.map((user, i) => (
            <li key={user.$id} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
              <Link
                href={`/users/${user.$id}/${slugify(user.name)}`}
                className="flex items-center gap-3"
              >
                <span className={`text-xs font-bold w-4 ${medalColors[i] ?? "text-muted-foreground"}`}>
                  {i < 3 ? <IconMedal size={14} /> : `#${i + 1}`}
                </span>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {user.prefs?.reputation ?? 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-0.5">rep</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}