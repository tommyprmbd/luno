import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TaskList from "../TaskList";
import type { Task } from "../../../types/task";

describe("TaskList", () => {
  it("should show empty state when there are no tasks", () => {
    render(
      <TaskList
        tasks={[]}
        activeTaskId={null}
        onAddTask={vi.fn()}
        onSelectTask={vi.fn()}
        onToggleTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByText("Add a task to get started.")).toBeInTheDocument();
  });

  it("should render tasks", () => {
    const tasks: Task[] = [
      {
        id: "task-1",
        title: "Build Luno",
        completed: false,
      },
      {
        id: "task-2",
        title: "Write tests",
        completed: false,
      },
    ];

    render(
      <TaskList
        tasks={tasks}
        activeTaskId={null}
        onAddTask={vi.fn()}
        onSelectTask={vi.fn()}
        onToggleTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByText("Build Luno")).toBeInTheDocument();
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  it("should add a task through the form", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(
      <TaskList
        tasks={[]}
        activeTaskId={null}
        onAddTask={onAddTask}
        onSelectTask={vi.fn()}
        onToggleTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    const input = screen.getByRole("textbox", {
      name: "New Task",
    });

    await user.type(input, "Build Luno");

    await user.click(
      screen.getByRole("button", {
        name: "ADD",
      }),
    );

    expect(onAddTask).toHaveBeenCalledWith("Build Luno");
  });
});
