import { useState } from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../../types/task";
import type { FormEvent } from "react";

type TaskListProps = {
  tasks: Task[];
  activeTaskId: string | null;
  isTimerRunning: boolean;
  onAddTask: (title: string) => void;
  onSelectTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

function TaskList({
  tasks,
  activeTaskId,
  isTimerRunning,
  onAddTask,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const [newTask, setNewTask] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTask.trim()) {
      return;
    }
    
    onAddTask(newTask);
    setNewTask("");
  }

  const remaining = tasks.filter((task) => !task.completed).length;

  return (
    <section className="tasks">
      <div className="tasks-header">
        <h2>📋 Task Orbit</h2>
        <span className="tasks-remaining">{remaining} remaining</span>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Add a new intention to your orbit..."
          aria-label="New Task"
        />

        <button type="submit">
          <span className="add-task-icon" aria-hidden="true">
            +
          </span>
          Add Task
        </button>
      </form>

      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={task.id === activeTaskId}
              isTimerRunning={isTimerRunning}
              onSelect={onSelectTask}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </ul>
      ) : (
        <p className="task-empty">Add a task to get started.</p>
      )}
    </section>
  );
}
export default TaskList;
