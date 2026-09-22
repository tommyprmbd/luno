import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTasks } from "../useTasks";

describe("useTasks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with no tasks", () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.activeTask).toBeNull();
    expect(result.current.activeTaskId).toBeNull();
  });

  it("should add a task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Build Luno");
    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("should trim task title", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("  Build Luno  ");
    });

    expect(result.current.tasks[0].title).toBe("Build Luno");
  });

  it("should ignore empty task title", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("   ");
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("should select a task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.selectTask(taskId);
    });

    expect(result.current.activeTaskId).toBe(taskId);
    expect(result.current.activeTask?.title).toBe("Build Luno");
  });

  it("should not select a completed task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTask(taskId);
    });

    act(() => {
      result.current.selectTask(taskId);
    });

    expect(result.current.activeTaskId).toBeNull();
  });

  it("should toggle task completion", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTask(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(true);

    act(() => {
      result.current.toggleTask(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("should clear active task when active task is completed", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.selectTask(taskId);
    });

    expect(result.current.activeTaskId).toBe(taskId);

    act(() => {
      result.current.toggleTask(taskId);
    });

    expect(result.current.activeTaskId).toBeNull();
  });

  it("should delete a task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("should clear active task when active task is deleted", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.selectTask(taskId);
    });

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.activeTaskId).toBeNull();
  });

  it("should persist tasks after update", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Build Luno");
    });

    const stored = localStorage.getItem("luno:tasks");

    expect(stored).not.toBeNull();

    const tasks = JSON.parse(stored!);

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Build Luno");
  });
});
