"use client";
import { BookOpen, CalendarCheck, TrendingUp, UserRound } from "lucide-react";

export type TabId = "today" | "progress" | "guide" | "profile";

const TABS = [
  { id: "today", label: "Today", Icon: CalendarCheck },
  { id: "progress", label: "Progress", Icon: TrendingUp },
  { id: "guide", label: "Guide", Icon: BookOpen },
  { id: "profile", label: "Profile", Icon: UserRound },
] as const;

export default function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-black/50 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-md">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-1 flex-col items-center gap-0.5 pb-1.5 pt-2 text-[10px] font-medium ${
              active === id ? "text-[#2FBFA6]" : "text-white/35"
            }`}
          >
            <Icon size={24} strokeWidth={active === id ? 2.4 : 1.8} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
