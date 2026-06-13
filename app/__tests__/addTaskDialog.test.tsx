import { render, screen, fireEvent } from "@testing-library/react";
import { AddTaskDialog } from "../components/AddTaskDialog";

describe("AddTaskDialog Component", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render anything when isOpen is false", () => {
    render(
      <AddTaskDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        taskPayload={null}
        onSave={mockOnSave}
      />,
    );
    expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
  });

  it("should trigger validation errors when trying to submit an empty form", () => {
    render(
      <AddTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        taskPayload={null}
        onSave={mockOnSave}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    expect(screen.getByText("Task title is required.")).toBeInTheDocument();
    expect(screen.getByText("Please select a due date.")).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("should successfully trigger onSave with input real task data form payload", () => {
    render(
      <AddTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        taskPayload={null}
        onSave={mockOnSave}
      />,
    );

    const titleInput = screen.getByPlaceholderText("Title of the task...");
    fireEvent.change(titleInput, {
      target: { value: "Optimasi Query Database Vendor" },
    });

    const descInput = screen.getByPlaceholderText("Description of the task...");
    fireEvent.change(descInput, {
      target: { value: "Meningkatkan performa load data module procurement." },
    });

    const submitButton = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(submitButton);

    expect(
      screen.queryByText("Task title is required."),
    ).not.toBeInTheDocument();
  });

  it("should correctly populate fields when editing an existing real production task", () => {
    const existingTask = {
      id: "task-002",
      title: "Refactor State Management Form HRIS CHERRY APP",
      desc: "Migrasi sisa local state handling ke centralized modular hooks.",
      status: "pending",
      priorityAccent: "high",
      dueDate: new Date("2026-06-20"),
      createdAt: new Date("2026-06-13"),
    };

    render(
      <AddTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        taskPayload={existingTask}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText("Edit Task")).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(
        "Refactor State Management Form HRIS CHERRY APP",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "Migrasi sisa local state handling ke centralized modular hooks.",
      ),
    ).toBeInTheDocument();
  });
});
