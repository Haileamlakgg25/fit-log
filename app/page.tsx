"use client";
import { useState } from "react";
import BottomNav, { type TabId } from "@/components/BottomNav";
import TodayTab from "@/components/TodayTab";
import ProgressTab from "@/components/ProgressTab";
import GuideTab from "@/components/GuideTab";
import ProfileTab from "@/components/ProfileTab";

export default function Home() {
  const [tab, setTab] = useState<TabId>("today");
  return (
    <>
      <main className="mx-auto min-h-dvh max-w-md px-4 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)]">
        {tab === "today" && <TodayTab />}
        {tab === "progress" && <ProgressTab />}
        {tab === "guide" && <GuideTab />}
        {tab === "profile" && <ProfileTab />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </>
  );
}
