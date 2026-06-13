import { render, screen, fireEvent, act } from "@testing-library/react";
import TaskDetailPage from "../workspace/[id]/page";
import { useParams, useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("TaskDetailPage Component", () => {
  const mockRouter = { back: jest.fn() };
  const mockTaskId = "test-task-123";

  const mockTasks = [
    {
      id: "test-task-123",
      title: "FINISH FRONTEND TESTING",
      desc: "Write high-quality unit tests using Jest.",
      status: "pending",
      priorityAccent: "high",
      dueDate: "2026-06-20T00:00:00.000Z",
      createdAt: "2026-06-13T00:00:00.000Z",
      workspaceId: "workspace-abc",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    window.localStorage.clear();

    (useParams as jest.Mock).mockReturnValue({ id: mockTaskId });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should display the skeleton loader initially", async () => {
    render(<TaskDetailPage />);

    expect(
      screen.queryByText("FINISH FRONTEND TESTING"),
    ).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(350);
    });
  });

  it("should render task details correctly after loading", async () => {
    window.localStorage.setItem("tasks", JSON.stringify(mockTasks));
    render(<TaskDetailPage />);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(screen.getByText("FINISH FRONTEND TESTING")).toBeInTheDocument();
    expect(
      screen.getByText("Write high-quality unit tests using Jest."),
    ).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("Mark Complete")).toBeInTheDocument();
  });

  it("should display a fallback message if the task is not found", async () => {
    window.localStorage.setItem("tasks", JSON.stringify([]));
    render(<TaskDetailPage />);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(
      screen.getByText("Task tidak ditemukan atau telah dihapus."),
    ).toBeInTheDocument();
  });

  it("should toggle the task completion status when the status button is clicked", async () => {
    window.localStorage.setItem("tasks", JSON.stringify(mockTasks));
    render(<TaskDetailPage />);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    const completionButton = screen.getByRole("button", {
      name: /mark complete/i,
    });
    fireEvent.click(completionButton);

    expect(screen.getByText("Completed")).toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem("tasks") || "[]");
    expect(stored[0].status).toBe("completed");
  });

  it("should navigate back when the 'Back To List' button is clicked", async () => {
    window.localStorage.setItem("tasks", JSON.stringify(mockTasks));
    render(<TaskDetailPage />);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    const backButton = screen.getByRole("button", { name: /back to list/i });
    fireEvent.click(backButton);

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
