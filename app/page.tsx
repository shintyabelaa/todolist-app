"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/utils";
import { Workspace } from "./components/Sidebar";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedWorkspaces = localStorage.getItem("workspaces");
    if (!storedWorkspaces) return;

    const workspaces: Workspace[] = JSON.parse(storedWorkspaces);
    if (!Array.isArray(workspaces) || workspaces.length === 0) return;

    const storedLastWorkspace = localStorage.getItem("lastWorkspace");

    if (storedLastWorkspace) {
      try {
        const lastWorkspace = JSON.parse(storedLastWorkspace);

        const existingWorkspace = workspaces.find(
          (ws) => ws.id === lastWorkspace.id,
        );

        if (existingWorkspace) {
          const slug = lastWorkspace.slug || createSlug(existingWorkspace.name);
          router.replace(`/workspace/${slug}`);
          return;
        }
      } catch (e) {
        console.error("Error parsing lastWorkspace data", e);
      }
    }

    router.replace(`/workspace/${createSlug(workspaces[0].name)}`);
  }, [router]);

  return (
    <main className="p-6">
      <SidebarTrigger />

      <div className="mt-4 text-sm text-muted-foreground">
        Redirecting to workspace...
      </div>
    </main>
  );
}
