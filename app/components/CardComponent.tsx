"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Check,
  EllipsisVertical,
  Pin,
  PinOff,
  RotateCcw,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Task } from "../workspace/page";

type CardProps = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date;
  task: Task;
  onUpdate: (updatedTask: Task, isEdit: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditClick: (task: Task) => void;
  onTogglePin?: (taskId: string) => void;
};

export const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-50 text-yellow-600",
  high: "bg-red-100 text-red-600",
};

export function CardComponent({
  id,
  title,
  description,
  priority,
  status,
  dueDate,
  task,
  onUpdate,
  onDelete,
  onEditClick,
  onTogglePin,
}: CardProps) {
  const router = useRouter();

  const changeStatus = (newStatus: string) => {
    const updatedTask = { ...task, status: newStatus };
    onUpdate(updatedTask, true);
  };

  const handleDeleteClick = () => {
    onDelete(id);
  };

  const handleCardClick = () => {
    router.push(`/workspace/${id}`);
  };

  return (
    <Card
      size="sm"
      className="mx-auto w-full border cursor-pointer p-2 max-w-sm bg-white"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center">
        <div
          className={`w-fit capitalize p-1 ml-2 text-xs font-medium rounded-md ${
            priorityColors[
              priority.toLowerCase() as keyof typeof priorityColors
            ] || "bg-gray-100 text-gray-600"
          }`}
        >
          {priority}
        </div>
        <div className="flex justify-center gap-2">
          {task.isPinned && onTogglePin && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-amber-500 hover:text-amber-600 hover:bg-stone-100"
              title="Unpin Task"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(id);
              }}
            >
              <Pin className="w-3.5 h-3.5 fill-current" />
            </Button>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                    <EllipsisVertical className="w-4 h-4" />
                  </Button>
                }
              />

              <PopoverContent className="w-44 p-2">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => onEditClick(task)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  {onTogglePin && (
                    <Button
                      variant="ghost"
                      className={`justify-start ${task.isPinned ? "text-amber-600 hover:text-amber-600" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(id);
                      }}
                    >
                      {task.isPinned ? (
                        <>
                          <PinOff className="w-4 h-4 mr-2" />
                          Unpin Weekend
                        </>
                      ) : (
                        <>
                          <Pin className="w-4 h-4 mr-2" />
                          Pin to Weekend
                        </>
                      )}
                    </Button>
                  )}

                  {status !== "pending" && (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => changeStatus("pending")}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Back to Pending
                    </Button>
                  )}

                  {status !== "completed" && (
                    <Button
                      variant="ghost"
                      className="justify-start text-green-600 hover:text-green-600"
                      onClick={() => changeStatus("completed")}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="justify-start text-red-500 hover:text-red-500"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <CardHeader className="">
        <CardTitle className="font-semibold capitalize">{title}</CardTitle>
        <CardDescription className="line-clamp-4">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="">
        <div className="flex gap-2 items-center text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <div>{new Date(dueDate).toLocaleDateString()}</div>{" "}
        </div>
      </CardFooter>
    </Card>
  );
}
