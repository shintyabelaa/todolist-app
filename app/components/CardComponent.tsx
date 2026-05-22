"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Check, EllipsisVertical, RotateCcw } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Task } from "../workspace/[workspaceId]/page";

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
}: CardProps) {
  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params.workspaceId as string;

  const changeStatus = (newStatus: string) => {
    const updatedTask = { ...task, status: newStatus };
    onUpdate(updatedTask, true);
  };

  const handleDeleteClick = () => {
    onDelete(id);
  };

  const handleCardClick = () => {
    if (!workspaceSlug) return;
    router.push(`/workspace/${workspaceSlug}/${id}`);
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
                {/* FIX: Tambahkan onClick handler untuk memicu modal edit */}
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => onEditClick(task)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>

                {status !== "in progress" && (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => changeStatus("in progress")}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    In Progress
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
