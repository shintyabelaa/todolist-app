"use client";

import { CardComponent } from "@/app/components/CardComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  TrendingUp,
  Layers,
  ArrowLeftCircle,
  ArrowRightCircle,
  Pin,
  Calendar as CalendarIcon,
} from "lucide-react";
import { AddTaskDialog } from "@/app/components/AddTaskDialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";

// Integrating your specific Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type Task = {
  id: string;
  title: string;
  desc: string;
  status: string;
  priorityAccent: string;
  dueDate: Date;
  createdAt: Date;
  isPinned?: boolean;
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
    label: "Completed",
    statusKey: "completed",
    color: "#059669",
    bgLight: "#d1fae5",
  },
];

export default function WorkspacePage() {
  const params = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setThrowError] = useState<Error | null>(null);

  const [activeMobileStatus, setActiveMobileStatus] = useState<string>("all");

  useEffect(() => {
    setIsLoading(true);

    const fetchList = setTimeout(() => {
      try {
        const storedTasks = localStorage.getItem("tasks");

        if (!storedTasks) {
          setTasks([]);
          setIsLoading(false);
          return;
        }

        const parsedTasks = JSON.parse(storedTasks);
        const workspaceTasks: Task[] = parsedTasks.map((task: Task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          isPinned: task.isPinned || false,
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

    return () => clearTimeout(fetchList);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (!date) return true;
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });

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

  const handleTogglePin = (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const pinnedCount = tasks.filter((t) => t.isPinned).length;

    if (!targetTask.isPinned && pinnedCount >= 3) {
      alert("You can only pin up to 3 tasks to your weekly view.");
      return;
    }

    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, isPinned: !t.isPinned } : t,
    );

    setTasks(updatedTasks);

    const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updatedAllTasks = allTasks.map((t: Task) =>
      t.id === taskId ? { ...t, isPinned: !t.isPinned } : t,
    );
    localStorage.setItem("tasks", JSON.stringify(updatedAllTasks));
  };

  const handlePrevDay = () => {
    setDate((prevDate) => {
      const current = prevDate ? new Date(prevDate) : new Date();
      current.setDate(current.getDate() - 1);
      return current;
    });
  };

  const handleNextDay = () => {
    setDate((prevDate) => {
      const current = prevDate ? new Date(prevDate) : new Date();
      current.setDate(current.getDate() + 1);
      return current;
    });
  };

  const formatScheduleHeader = (d: Date | undefined) => {
    if (!d) return "Select Date";
    return d.toLocaleDateString("en-US", { weekday: "long", day: "numeric" });
  };

  const getStatusColumnConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#faf8f5", indicator: "#d97706", text: "#92400e" };
      case "completed":
        return { bg: "#edf7f4", indicator: "#059669", text: "#065f46" };
      default:
        return { bg: "#f5f5f4", indicator: "#78716c", text: "#44403c" };
    }
  };

  return (
    <main
      className="min-h-screen w-full"
      style={{ backgroundColor: "#fdfbf7" }}
    >
      <div className="grid w-full grid-cols-1 lg:grid-cols-4 items-stretch">
        <div className="hidden lg:flex bg-white w-full min-h-screen py-12 px-6 items-start border-r border-stone-200/60 shadow-sm">
          <div className="flex flex-col gap-4 w-full sticky top-12">
            <div className="flex gap-2 text-sm">
              <span className="text-primary font-black text-xl uppercase">
                Taskly Workspace
              </span>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <h1 className="text-xl font-bold tracking-wide text-stone-800 flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-500 fill-current" />
                Weekly Pinned
              </h1>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-80 pr-0.5">
                {tasks
                  .filter((task) => task.isPinned)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="transition duration-200 ease-in-out hover:-translate-y-0.5"
                    >
                      <CardComponent
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
                        onTogglePin={handleTogglePin}
                      />
                    </div>
                  ))}
                {tasks.filter((task) => task.isPinned).length === 0 && (
                  <p className="text-xs font-semibold text-stone-400 text-center py-8 border border-dashed rounded-xl border-stone-200 bg-stone-50/50">
                    No pinned items for the weekend.
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mt-6 border-t border-stone-100 pt-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg w-full border border-stone-200/60 shadow-none bg-white"
              />
            </div>
          </div>
        </div>

        <div className="py-8 px-4 sm:px-6 lg:py-12 lg:col-span-2">
          <div className="flex justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1.5 w-fit">
              <div className="text-2xl sm:text-4xl tracking-tight font-bold  text-stone-900">
                Today&apos;s Schedule
              </div>
              <div className="flex items-center w-full justify-between mt-1">
                <div className="text-lg font-medium text-primary">
                  {formatScheduleHeader(date)}
                </div>
                <div className="flex gap-1.5">
                  <ArrowLeftCircle
                    onClick={handlePrevDay}
                    className="w-5 h-5 text-stone-400 cursor-pointer hover:text-stone-700 transition-colors"
                  />
                  <ArrowRightCircle
                    onClick={handleNextDay}
                    className="w-5 h-5 text-stone-400 cursor-pointer hover:text-stone-700 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="block lg:hidden">
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white border-stone-200 shadow-sm"
                      >
                        <CalendarIcon className="w-4 h-4 text-stone-600" />
                      </Button>
                    }
                  ></DialogTrigger>
                  <DialogContent className="fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 max-h-[90vh] w-full max-w-full rounded-t-2xl rounded-b-none p-6 bg-white border-x-0 border-b-0 border-t border-stone-200 shadow-2xl overflow-y-auto duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
                    <DialogHeader className="text-left pb-2">
                      <DialogTitle className="text-base font-black text-stone-900">
                        Workspace Options
                      </DialogTitle>
                      <DialogDescription className="text-xs text-stone-400 font-medium">
                        View active targets or switch dates below.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 mt-4 pb-6">
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/40">
                        <h3 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
                          <Pin className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          Pinned Tasks ({tasks.filter((t) => t.isPinned).length}
                          )
                        </h3>
                        <div className="flex flex-col gap-2">
                          {tasks
                            .filter((t) => t.isPinned)
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
                                onTogglePin={handleTogglePin}
                              />
                            ))}
                          {tasks.filter((t) => t.isPinned).length === 0 && (
                            <p className="text-xs font-medium text-stone-400 text-center py-4">
                              No pinned items.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center border border-stone-200 rounded-xl p-2 bg-white w-full overflow-hidden">
                        <div className="w-full max-w-sm scale-95 origin-top">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Button
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 shadow-md bg-primary text-white"
                onClick={handleOpenAddModal}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isLoading && filteredTasks.length > 0 && (
            <div className="flex lg:hidden items-center gap-1.5 mt-6 p-1.5 bg-stone-200/40 rounded-xl overflow-x-auto">
              <button
                onClick={() => setActiveMobileStatus("all")}
                className={`flex-1 flex justify-center items-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg transition-all capitalize whitespace-nowrap ${
                  activeMobileStatus === "all"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All ({filteredTasks.length})</span>
              </button>
              {["pending", "completed"].map((status) => {
                const config = getStatusColumnConfig(status);
                const count = filteredTasks.filter(
                  (t) => t.status === status,
                ).length;
                const isSelected = activeMobileStatus === status;

                return (
                  <button
                    key={status}
                    onClick={() => setActiveMobileStatus(status)}
                    className={`flex-1 flex justify-center items-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg transition-all capitalize whitespace-nowrap ${
                      isSelected
                        ? "bg-white shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
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
            <div className="grid mt-6 lg:mt-10 gap-4 grid-cols-1 md:grid-cols-2 items-stretch">
              {[1, 2].map((idx) => (
                <Skeleton
                  key={idx}
                  className="h-50 w-full rounded-xl bg-stone-200/60"
                />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="mt-8 flex w-full flex-col items-center">
              <div className="text-stone-400 text-center rounded-2xl border border-dashed border-stone-200 bg-white p-12 w-full min-h-75 flex items-center justify-center text-sm font-medium shadow-sm">
                No tasks scheduled for this day.
              </div>
            </div>
          ) : (
            <div className="grid mt-6 lg:mt-10 gap-6 grid-cols-1 md:grid-cols-2 items-stretch">
              {["pending", "completed"].map((status) => {
                const config = getStatusColumnConfig(status);
                const isHiddenOnMobile =
                  activeMobileStatus !== "all" && activeMobileStatus !== status;
                const columnTasks = filteredTasks.filter(
                  (task) => task.status === status,
                );

                return (
                  <div
                    key={status}
                    className={`text-sm w-full flex rounded-2xl border border-stone-200/80 flex-col gap-3 p-3 h-full shadow-xs transition-all ${
                      isHiddenOnMobile ? "hidden lg:flex" : "flex"
                    }`}
                    style={{ backgroundColor: config.bg }}
                  >
                    <div className="flex items-center p-1 justify-between border-b border-stone-200/40 pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: config.indicator }}
                        />
                        <p
                          className="font-black uppercase text-xs tracking-wider"
                          style={{ color: config.text }}
                        >
                          {status}
                        </p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 border border-stone-200/30 text-stone-700">
                          {columnTasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto max-h-125 pr-0.5">
                      {columnTasks.map((task) => (
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
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                      {columnTasks.length === 0 && (
                        <p className="text-xs font-medium text-stone-400 text-center py-12">
                          Empty column
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="py-6 px-4 sm:px-6 lg:py-12 flex flex-col gap-6 lg:col-span-1">
          <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1">
            {cardStats.map((card, index) => (
              <Card
                key={index}
                className="w-full p-2 border border-stone-200/60 rounded-xl shadow-xs bg-white transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                  <CardTitle className="font-bold text-xs uppercase tracking-wider text-stone-400">
                    {card.label}
                  </CardTitle>
                  <div
                    className="p-1.5 rounded-lg text-white"
                    style={{ backgroundColor: card.color }}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-1.5">
                  {isLoading ? (
                    <Skeleton className="h-8 w-12 mt-1" />
                  ) : (
                    <h1
                      className="text-3xl font-black tracking-tight"
                      style={{ color: card.color }}
                    >
                      {card.statusKey === "total" && tasks.length}
                      {card.statusKey === "pending" &&
                        tasks.filter((t) => t.status === "pending").length}
                      {card.statusKey === "completed" &&
                        tasks.filter((t) => t.status === "completed").length}
                    </h1>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <AddTaskDialog
            key={editingTask ? editingTask.id : "new-task"}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            taskPayload={editingTask}
            onSave={handleSaveTask}
          />
        </div>
      </div>
    </main>
  );
}
