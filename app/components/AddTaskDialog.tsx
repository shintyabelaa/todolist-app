"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const priorities = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

type Task = {
  id: string;
  title: string;
  desc: string;
  status: string;
  priorityAccent: string;
  dueDate: Date;
  createdAt: Date;
  workspaceId: string;
};

type TaskFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  taskPayload: Task | null;
  onSave: (task: Task, isEditMode: boolean) => void;
};

export function AddTaskDialog({
  isOpen,
  onOpenChange,
  workspaceId,
  taskPayload,
  onSave,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState(taskPayload?.title || "");
  const [desc, setDesc] = useState(taskPayload?.desc || "");
  const [priorityAccent, setPriorityAccent] = useState<string>(
    taskPayload?.priorityAccent || "medium",
  );
  const [date, setDate] = useState<Date | undefined>(
    taskPayload ? new Date(taskPayload.dueDate) : undefined,
  );
  const isEditMode = !!taskPayload;
  const isFormInvalid = !title.trim() || !date || !workspaceId;
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);

    if (!open) {
      setTitle(taskPayload?.title || "");
      setDesc(taskPayload?.desc || "");
      setPriorityAccent(taskPayload?.priorityAccent || "medium");
      setDate(taskPayload ? new Date(taskPayload.dueDate) : undefined);
    }
  };

  const handleSubmit = () => {
    if (isFormInvalid) return;
    const dataToSave: Task = {
      id: taskPayload ? taskPayload.id : crypto.randomUUID(),
      title,
      desc,
      status: taskPayload ? taskPayload.status : "pending",
      workspaceId,
      priorityAccent: priorityAccent || "medium",
      dueDate: date || new Date(),
      createdAt: taskPayload ? taskPayload.createdAt : new Date(),
    };

    onSave(dataToSave, isEditMode);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to your task details below."
              : "Create a new task for your workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-0.5">
              <span>Task Title</span>
              <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              placeholder="Title of the task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Description of the task..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <div className="flex flex-col w-full gap-2">
            <Label>Priority Accent</Label>
            <Select
              value={priorityAccent}
              onValueChange={(val) => setPriorityAccent(val ?? "medium")}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {priorities.find((p) => p.value === priorityAccent)?.label ||
                    "Select priority"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full gap-2">
            <Label className="flex items-center gap-0.5">
              <span>Due Date</span>
              <span className="text-red-500 font-bold">*</span>
            </Label>{" "}
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="justify-start font-normal w-full"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button onClick={handleSubmit} disabled={isFormInvalid}>
            {isEditMode ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
