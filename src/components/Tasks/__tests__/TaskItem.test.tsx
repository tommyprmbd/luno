import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TaskItem from "../TaskItem";
import type { Task } from "../../../types/task";

const task: Task = {
  id: "task-1",
  title: "Build Luno",
  completed: false,
};

describe("TaskItem", () => {
  it("should render task title", () => {
    render(
      <TaskItem
        task={task}
        isTimerRunning={true}
        isActive={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Build Luno")).toBeInTheDocument();
  });

  it("should call onSelect when focus button is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TaskItem
        task={task}
        isTimerRunning={false}
        isActive={false}
        onSelect={onSelect}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "FOCUS" }));

    expect(onSelect).toHaveBeenCalledWith("task-1");
  });

  it("should call onToggle when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <TaskItem
        task={task}
        isActive={false}
        isTimerRunning={false}
        onSelect={vi.fn()}
        onToggle={onToggle}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith("task-1");
  });

  it("should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskItem
        task={task}
        isActive={false}
        isTimerRunning={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete Build Luno",
      }),
    );

    expect(onDelete).toHaveBeenCalledWith("task-1");
  });

  it("should disable task interactions while timer is running", () => {
    const task: Task = {
      id: "task-1",
      title: "Build Luno",
      completed: false,
    };

    render(
      <TaskItem
        task={task}
        isActive={false}
        isTimerRunning={true}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "FOCUS",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Delete Build Luno",
      }),
    ).toBeEnabled();
  });

  it("should enable task interactions when timer is not running", () => {
    const task: Task = {
      id: "task-1",
      title: "Build Luno",
      completed: false,
    };

    render(
      <TaskItem
        task={task}
        isActive={false}
        isTimerRunning={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "FOCUS",
      }),
    ).toBeEnabled();
  });

  it("should call onDelete when delete button is clicked while timer is running", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    const task: Task = {
      id: "task-1",
      title: "Build Luno",
      completed: false,
    };

    render(
      <TaskItem
        task={task}
        isActive={false}
        isTimerRunning={true}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete Build Luno",
      }),
    );

    expect(onDelete).toHaveBeenCalledWith("task-1");
  });
});
