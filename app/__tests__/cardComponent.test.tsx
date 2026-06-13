import { render, screen, fireEvent } from "@testing-library/react";
import { CardComponent } from "../components/CardComponent";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CardComponent", () => {
  const mockRouter = { push: jest.fn() };
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEditClick = jest.fn();
  const mockOnTogglePin = jest.fn();

  const sampleTask = {
    id: "task-1",
    title: "Pilih Jurusan Platform Assessment",
    desc: "Review production stability metrics.",
    status: "pending",
    priorityAccent: "medium",
    dueDate: new Date("2026-06-25"),
    createdAt: new Date("2026-06-13"),
    isPinned: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should render card information details correctly", () => {
    render(
      <CardComponent
        id={sampleTask.id}
        title={sampleTask.title}
        description={sampleTask.desc}
        priority={sampleTask.priorityAccent}
        status={sampleTask.status}
        dueDate={sampleTask.dueDate}
        task={sampleTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEditClick={mockOnEditClick}
        onTogglePin={mockOnTogglePin}
      />,
    );

    expect(
      screen.getByText("Pilih Jurusan Platform Assessment"),
    ).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("should navigate to task detail page when the whole card is clicked", () => {
    render(
      <CardComponent
        id={sampleTask.id}
        title={sampleTask.title}
        description={sampleTask.desc}
        priority={sampleTask.priorityAccent}
        status={sampleTask.status}
        dueDate={sampleTask.dueDate}
        task={sampleTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEditClick={mockOnEditClick}
        onTogglePin={mockOnTogglePin}
      />,
    );

    const cardElement =
      screen.getByText("Pilih Jurusan Platform Assessment").closest(".card") ||
      screen.getByText("Pilih Jurusan Platform Assessment");
    fireEvent.click(cardElement);

    expect(mockRouter.push).toHaveBeenCalledWith("/workspace/task-1");
  });

  it("should safely call onTogglePin and prevent event bubbling execution down to card router clicks", () => {
    render(
      <CardComponent
        id={sampleTask.id}
        title={sampleTask.title}
        description={sampleTask.desc}
        priority={sampleTask.priorityAccent}
        status={sampleTask.status}
        dueDate={sampleTask.dueDate}
        task={sampleTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEditClick={mockOnEditClick}
        onTogglePin={mockOnTogglePin}
      />,
    );

    const pinButton = screen.getByTitle("Unpin Task");
    fireEvent.click(pinButton);

    expect(mockOnTogglePin).toHaveBeenCalledWith("task-1");
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
