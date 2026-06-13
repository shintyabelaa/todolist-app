"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Clock, CheckIcon, ArrowLeftIcon } from "lucide-react";
import { format } from "date-fns";
import { priorityColors } from "@/app/components/CardComponent";
import { Skeleton } from "@/components/ui/skeleton";

type Task = {
  id: string;
  title: string;
  desc: string;
  status: string;
  priorityAccent: string;
  dueDate: string;
  createdAt: string;
  workspaceId: string;
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);

  const [task, setTask] = useState<Task | null>(() => {
    if (typeof window === "undefined" || !taskId) return null;

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      return parsedTasks.find((t: Task) => t.id === taskId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (!taskId) {
      const fetchDetailTask = setTimeout(() => {
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(fetchDetailTask);
    }

    const fetchDetailTask = setTimeout(() => {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const foundTask = parsedTasks.find((t: Task) => t.id === taskId);
        setTask(foundTask || null);
      }
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(fetchDetailTask);
  }, [taskId]);

  const handleToggleCompleted = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (!storedTasks) return;

    const parsedTasks = JSON.parse(storedTasks);
    const updatedTasks = parsedTasks.map((t: Task) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: t.status === "completed" ? "in progress" : "completed",
        };
      }
      return t;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTask((prev) =>
      prev
        ? {
            ...prev,
            status: prev.status === "completed" ? "in progress" : "completed",
          }
        : null,
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 w-full md:p-6 min-h-screen bg-[#faf8f5] flex flex-col items-center gap-4">
        <div className="w-full max-w-2xl flex items-start">
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <div className="w-full max-w-2xl flex flex-col gap-6 bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-7 w-32 rounded-md" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-7 w-3/4 rounded-md mb-2" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            <div className="flex gap-4 w-full mt-2">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] text-stone-500 font-medium text-sm">
        Task tidak ditemukan atau telah dihapus.
      </div>
    );
  }

  const isCompleted = task.status === "completed";

  return (
    <div className="p-4 w-full md:p-6 min-h-screen bg-[#faf8f5] flex flex-col items-center gap-4">
      <div className="w-full max-w-2xl flex items-start">
        <button
          onClick={() => router.back()}
          className="flex items-center text-xs w-fit bg-white border border-stone-200 gap-2 rounded-full px-4 py-1.5 font-medium shadow-sm hover:bg-stone-50 transition-colors text-stone-800"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5 text-stone-800" />
          <div>Back To List</div>
        </button>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4 bg-white border border-stone-200 rounded-lg p-6 shadow-sm text-stone-800">
        <div className="flex justify-between items-center">
          <div
            className={`uppercase text-[11px] tracking-wider w-fit border rounded-md px-2.5 py-1 font-bold ${
              priorityColors[
                task.priorityAccent?.toLowerCase() as keyof typeof priorityColors
              ] || "bg-stone-50 border-stone-200 text-stone-600"
            }`}
          >
            {task.priorityAccent}
          </div>
          <button
            onClick={handleToggleCompleted}
            className={`capitalize flex items-center text-xs w-fit border gap-2 rounded-md p-1 px-2.5 font-semibold transition-colors ${
              isCompleted
                ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
            }`}
          >
            <CheckIcon
              className={`w-4 h-4 ${isCompleted ? "text-green-600" : "text-stone-400"}`}
            />
            <div>{isCompleted ? "Completed" : "Mark Complete"}</div>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-xl font-bold tracking-tight text-stone-900 uppercase">
              {task.title}
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wide">
              <span>Description & Objectives</span>
            </div>
            <div className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 bg-stone-50/40 whitespace-pre-wrap min-h-15">
              {task.desc || "No description provided."}
            </div>
          </div>

          <div className="flex gap-4 w-full mt-2">
            <div className="flex w-full gap-2 rounded-md border border-stone-200 p-2 items-center text-xs font-medium text-stone-900">
              <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-stone-400 text-[10px] font-bold uppercase">
                  Due Date:
                </span>
                <span className="font-bold text-stone-700">
                  {format(new Date(task.dueDate), "yyyy-MM-dd")}
                </span>
              </div>
            </div>
            <div className="flex w-full gap-2 rounded-md border border-stone-200 p-2 items-center text-xs font-medium text-stone-900">
              <Clock className="w-4 h-4 text-stone-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-stone-400 text-[10px] font-bold uppercase">
                  Created At:
                </span>
                <span className="font-bold text-stone-700">
                  {format(new Date(task.createdAt), "yyyy-MM-dd")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
