"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Form, Plus } from "lucide-react";
import { createSlug } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Menggunakan komponen asli Shadcn

export type Workspace = {
  id: string;
  name: string;
  color: string;
};

const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export function AppSidebar() {
  const router = useRouter();
  const params = useParams();
  const currentWorkspaceSlug = params.workspaceId as string;

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedWorkspaces = localStorage.getItem("workspaces");
      if (storedWorkspaces) {
        setWorkspaces(JSON.parse(storedWorkspaces));
      }
      setIsLoaded(true);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("workspaces", JSON.stringify(workspaces));
  }, [workspaces, isLoaded]);

  const addWorkspace = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newName = `Workspace ${workspaces.length + 1}`;

    const newWorkspace: Workspace = {
      id: crypto.randomUUID(),
      name: newName,
      color: randomColor,
    };

    setWorkspaces((prev) => [...prev, newWorkspace]);
    router.push(`/workspace/${createSlug(newName)}`);
  };

  const startEditing = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditingValue(currentName);
  };

  const saveWorkspaceName = (index: number) => {
    if (!editingValue.trim()) return;

    const updatedWorkspaces = [...workspaces];
    const oldSlug = createSlug(updatedWorkspaces[index].name);
    updatedWorkspaces[index].name = editingValue;
    const newSlug = createSlug(editingValue);

    setWorkspaces(updatedWorkspaces);
    setEditingIndex(null);
    setEditingValue("");

    if (currentWorkspaceSlug === oldSlug) {
      router.push(`/workspace/${newSlug}`);
    }
  };

  const goToWorkspace = (name: string) => {
    router.push(`/workspace/${createSlug(name)}`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2">
          <Form className="w-8 h-8 text-white rounded bg-primary p-2" />
          <div className="flex flex-col text-sm">
            <div className="font-bold">TaskFlow</div>
            <div className="text-muted-foreground text-xs font-semibold">
              Multi-Workspace
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="flex px-6 pt-4 justify-between items-center">
          <p className="uppercase text-muted-foreground text-xs font-bold">
            Workspaces
          </p>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={addWorkspace}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex flex-col">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center px-6 py-3 gap-2">
                <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                <Skeleton className="h-4 w-28 rounded-sm" />
              </div>
            ))
          ) : workspaces.length === 0 ? (
            <p className="text-xs font-medium text-stone-400 px-6 py-2">
              No workspaces found.
            </p>
          ) : (
            workspaces.map((workspace, index) => {
              const workspaceSlug = createSlug(workspace.name);
              const isActive = workspaceSlug === currentWorkspaceSlug;

              return (
                <div
                  key={workspace.id}
                  onClick={() => goToWorkspace(workspace.name)}
                  className={`flex items-center justify-between px-6 py-3 transition-colors cursor-pointer group ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: workspace.color }}
                    />

                    {editingIndex === index ? (
                      <input
                        autoFocus
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()} 
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveWorkspaceName(index);
                          if (e.key === "Escape") setEditingIndex(null);
                        }}
                        onBlur={() => saveWorkspaceName(index)}
                        className="bg-background text-sm font-bold border border-stone-300 px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-primary w-full text-foreground"
                      />
                    ) : (
                      <span
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEditing(index, workspace.name);
                        }}
                        className={`text-sm font-bold truncate ${isActive ? "font-extrabold" : ""}`}
                        title="Double click to rename"
                      >
                        {workspace.name}
                      </span>
                    )}
                  </div>

                  {editingIndex !== index && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        startEditing(index, workspace.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded transition-opacity ml-2 shrink-0"
                    ></button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
