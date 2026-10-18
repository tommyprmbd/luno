import { STORAGE_KEY } from "../constants/storage";
import type { Task } from "../types/task";
import { useLocalStorage } from "./useLocalStorage";

const isTask = (value: unknown): value is Task =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Task).id === "string" &&
  typeof (value as Task).title === "string" &&
  typeof (value as Task).completed === "boolean";

const readTasks = (value: unknown): Task[] | null =>
  Array.isArray(value) ? value.filter(isTask) : null;

// fallback keeps task creation working outside a secure context (no crypto.randomUUID)
const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    STORAGE_KEY.tasks,
    [],
    readTasks,
  );

  const [activeTaskId, setActiveTaskId] = useLocalStorage<string | null>(
    STORAGE_KEY.activeTaskId,
    null,
  );

  function addTask(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const task: Task = {
      id: createId(),
      title: trimmedTitle,
      completed: false,
    };

    setTasks((current) => [...current, task]);
  }

  function selectTask(id: string) {
    const task = tasks.find((current) => current.id === id);

    if (!task || task.completed) {
      return;
    }

    setActiveTaskId(id);
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );

    if (id === activeTaskId) {
      setActiveTaskId(null);
    }
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));

    if (id === activeTaskId) {
      setActiveTaskId(null);
    }
  }

  const activeTask = tasks.find((task) => task.id === activeTaskId) ?? null;

  return {
    tasks,
    activeTask,
    activeTaskId,
    addTask,
    selectTask,
    toggleTask,
    deleteTask,
  };
}
