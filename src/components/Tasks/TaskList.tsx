import { useState } from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../../types/task";
import type { FormEvent } from "react";

function TaskList() {
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
  }

  function deleteTask(id: string) {
    setTask((current) => current.filter((task) => task.id !== id));
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
