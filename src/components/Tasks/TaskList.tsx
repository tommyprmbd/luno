import { useState } from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../../types/task";
import type { FormEvent } from "react";

type TaskListProps = {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string) => void;
  onSelectTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

function TaskList({
  tasks,
  activeTaskId,
  onAddTask,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const [newTask, setNewTask] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddTask(newTask);
    setNewTask("");
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
              onSelect={onSelectTask}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
export default TaskList;
