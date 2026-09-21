import { useState } from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../../types/task";
import type { FormEvent } from "react";

type TaskListProps = {
  activeTaskId: string | null;
  onSelectTask: (task: Task) => void;
  onActiveTaskRemoved: () => void;
};

function TaskList({activeTaskId, onSelectTask, onActiveTaskRemoved}: TaskListProps) {
  const [tasks, setTask] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  function addTask() {
    const title = newTask.trim();

    if (!title) {
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    setTask((current) => [...current, task]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    setTask((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );

    if (id === activeTaskId) {
      onActiveTaskRemoved();
    }
  }

  function deleteTask(id: string) {
    setTask((current) => current.filter((task) => task.id !== id));

    if (id === activeTaskId) {
      onActiveTaskRemoved();
    }
  }

  function selectTask(id: string) {
    const task = tasks.find((current) => current.id === id);

    if (!task || task.completed) {
      return;
    }

    onSelectTask(task);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTask();
  }

  return (
    <section className="tasks">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="What are you working on?"
          aria-label="New Task"
        />

        <button type="submit">ADD</button>
      </form>

      {tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={task.id === activeTaskId}
              onSelect={selectTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
export default TaskList;
