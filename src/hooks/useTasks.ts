import { STORAGE_KEY } from "../constants/storage";
import type { Task } from "../types/task";
import { useLocalStorage } from "./useLocalStorage";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY.tasks, []);

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
      id: crypto.randomUUID(),
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
