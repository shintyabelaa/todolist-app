"use client";

import { CardComponent } from "@/app/components/CardComponent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, Layers } from "lucide-react";
import { AddTaskDialog } from "@/app/components/AddTaskDialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Workspace = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  desc: string;
  status: string;
  priorityAccent: string;
  dueDate: Date;
  createdAt: Date;
  workspaceId: string;
};

const cardStats = [
  {
    label: "Total Tasks",
    statusKey: "total",
    color: "#78716c",
    bgLight: "#f5f5f4",
  },
  {
    label: "Pending",
    statusKey: "pending",
    color: "#d97706",
    bgLight: "#fef3c7",
  },
  {
    label: "In Progress",
    statusKey: "in progress",
    color: "#2563eb",
    bgLight: "#dbeafe",
  },
  {
    label: "Completed",
    statusKey: "completed",
    color: "#059669",
    bgLight: "#d1fae5",
  },
];

export default function WorkspacePage() {
  const params = useParams();
  const workspaceSlug = params.workspaceId as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setThrowError] = useState<Error | null>(null);

  const [activeMobileStatus, setActiveMobileStatus] = useState<string>("all");

  useEffect(() => {
    if (!workspaceSlug) return;
    setIsLoading(true);

    const timer = setTimeout(() => {
      try {
        const storedWorkspaces = localStorage.getItem("workspaces");
        const storedTasks = localStorage.getItem("tasks");

        if (!storedWorkspaces) {
          setIsLoading(false);
          return;
        }

        const parsedWorkspaces: Workspace[] = JSON.parse(storedWorkspaces);
        const currentWorkspace = parsedWorkspaces.find(
          (ws) => createSlug(ws.name) === workspaceSlug,
        );

        if (!currentWorkspace) {
          setWorkspace(null);
          setIsLoading(false);
          return;
        }

        setWorkspace(currentWorkspace);

        localStorage.setItem(
          "lastWorkspace",
          JSON.stringify({ id: currentWorkspace.id, slug: workspaceSlug }),
        );

        if (!storedTasks) {
          setTasks([]);
          setIsLoading(false);
          return;
        }

        const parsedTasks = JSON.parse(storedTasks);
        const workspaceTasks: Task[] = parsedTasks
          .filter((task: Task) => task.workspaceId === currentWorkspace.id)
          .map((task: Task) => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt),
          }));

        setTasks(workspaceTasks);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setThrowError(() => {
          throw error;
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [workspaceSlug]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = (taskData: Task, isEditMode: boolean) => {
    if (isEditMode) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? taskData : t)),
      );
      const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      localStorage.setItem(
        "tasks",
        JSON.stringify(
          allTasks.map((t: Task) => (t.id === taskData.id ? taskData : t)),
        ),
      );
    } else {
      setTasks((prev) => [...prev, taskData]);
      const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      localStorage.setItem("tasks", JSON.stringify([...allTasks, taskData]));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const filteredAllTasks = allTasks.filter(
      (task: Task) => task.id !== taskId,
    );
    localStorage.setItem("tasks", JSON.stringify(filteredAllTasks));
  };

  const getStatusColumnConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#faf8f5", indicator: "#d97706", text: "#92400e" };
      case "in progress":
        return { bg: "#f0f4f9", indicator: "#2563eb", text: "#1e40af" };
      case "completed":
        return { bg: "#edf7f4", indicator: "#059669", text: "#065f46" };
      default:
        return { bg: "#f5f5f4", indicator: "#78716c", text: "#44403c" };
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#fdfbf7" }}>
      <div className="flex bg-white p-6 items-center justify-between border-b border-stone-200/60 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-stone-900 font-extrabold tracking-wider text-xs">
              DASHBOARD
            </span>
            <span className="text-stone-300">/</span>
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span className="capitalize text-stone-500 font-medium">
                {workspace ? workspace.name : "Loading..."}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleOpenAddModal} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-1" /> Add Task
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AddTaskDialog
          key={editingTask ? editingTask.id : "new-task"}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          workspaceId={workspace?.id || ""}
          taskPayload={editingTask}
          onSave={handleSaveTask}
        />
      </div>

      <div className="p-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mt-2">
          {cardStats.map((card, index) => (
            <Card
              key={index}
              className={
                "w-full p-2 max-w-sm border border-stone-200/10 rounded-xl shadow-sm bg-white cursor-pointer transition-all md:cursor-default"
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="font-bold text-xs uppercase tracking-wider text-stone-500">
                  {card.label}
                </CardTitle>
                <div
                  className="p-1.5 rounded-lg text-white"
                  style={{ backgroundColor: card.color }}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <Skeleton className="h-9 w-16 mt-1" />
                ) : (
                  <h1
                    className="text-4xl font-black tracking-tight"
                    style={{ color: card.color }}
                  >
                    {card.statusKey === "total" && tasks.length}
                    {card.statusKey === "pending" &&
                      tasks.filter((t) => t.status === "pending").length}
                    {card.statusKey === "in progress" &&
                      tasks.filter((t) => t.status === "in progress").length}
                    {card.statusKey === "completed" &&
                      tasks.filter((t) => t.status === "completed").length}
                  </h1>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && tasks.length > 0 && (
          <div className="flex md:hidden items-center gap-1.5 mt-6 p-1  rounded-xl overflow-scroll-hidden overflow-x-auto">
            <button
              onClick={() => setActiveMobileStatus("all")}
              className={`flex-1 flex justify-center items-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-lg transition-all capitalize whitespace-nowrap ${
                activeMobileStatus === "all"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All ({tasks.length})</span>
            </button>
            {["pending", "in progress", "completed"].map((status) => {
              const config = getStatusColumnConfig(status);
              const count = tasks.filter((t) => t.status === status).length;
              const isSelected = activeMobileStatus === status;

              return (
                <button
                  key={status}
                  onClick={() => setActiveMobileStatus(status)}
                  className={`flex-1 flex justify-center items-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-lg transition-all capitalize whitespace-nowrap ${
                    isSelected
                      ? "bg-white shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                  style={isSelected ? { color: config.text } : {}}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: config.indicator }}
                  />
                  <span>
                    {status} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="grid mt-6 md:mt-10 gap-6 grid-cols-1 md:grid-cols-3 items-stretch min-h-150">
            {["pending", "in progress", "completed"].map((status) => {
              const config = getStatusColumnConfig(status);
              return (
                <div
                  key={status}
                  className="w-full flex rounded-xl border border-stone-200 flex-col gap-3 p-3 h-full shadow-sm"
                  style={{ backgroundColor: config.bg }}
                >
                  <div className="flex items-center p-1 justify-between border-b border-stone-200/50 pb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: config.indicator }}
                      />
                      <p
                        className="font-extrabold uppercase text-xs tracking-wider"
                        style={{ color: config.text }}
                      >
                        {status}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[1, 2].map((idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-2.5 shadow-sm"
                      >
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-3 w-full" />
                        <div className="flex justify-between items-center mt-2 pt-1">
                          <Skeleton className="h-5 w-14 rounded-full" />
                          <Skeleton className="h-3.5 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-10 flex w-full flex-col items-center gap-4">
            <p className="text-stone-400 text-center rounded-xl border border-dashed border-stone-200 bg-white p-12 w-full min-h-150 text-sm font-medium">
              No tasks found in this workspace.
            </p>
          </div>
        ) : (
          <div className="grid mt-6 md:mt-10 gap-6 grid-cols-1 md:grid-cols-3 items-stretch min-h-150">
            {["pending", "in progress", "completed"].map((status) => {
              const config = getStatusColumnConfig(status);

              const isHiddenOnMobile =
                activeMobileStatus !== "all" && activeMobileStatus !== status;

              return (
                <div
                  key={status}
                  className={`text-sm w-full flex rounded-xl border border-stone-200 flex-col gap-3 p-3 h-full shadow-sm transition-all ${
                    isHiddenOnMobile ? "hidden md:flex" : "flex"
                  }`}
                  style={{ backgroundColor: config.bg }}
                >
                  <div className="flex items-center p-1 justify-between border-b border-stone-200/50 pb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: config.indicator }}
                      />
                      <p
                        className="font-extrabold uppercase text-xs tracking-wider"
                        style={{ color: config.text }}
                      >
                        {status}
                      </p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200/60 text-stone-700">
                        {tasks.filter((task) => task.status === status).length}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto max-h-150 pr-0.5">
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <CardComponent
                          key={task.id}
                          task={task}
                          id={task.id}
                          status={task.status}
                          title={task.title}
                          description={task.desc}
                          priority={task.priorityAccent}
                          dueDate={task.dueDate}
                          onUpdate={handleSaveTask}
                          onDelete={handleDeleteTask}
                          onEditClick={handleOpenEditModal}
                        />
                      ))}
                    {tasks.filter((task) => task.status === status).length ===
                      0 && (
                      <p className="text-xs font-semibold text-stone-400 text-center py-8">
                        Empty columns.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
