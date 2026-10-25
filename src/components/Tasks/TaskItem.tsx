import type { Task } from "../../types/task";

type TaskItemProps = {
  task: Task;
  isActive: boolean;
  isTimerRunning: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskItem({
  task,
  isActive,
  isTimerRunning,
  onSelect,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li
      className={[
        "task-item",
        isActive ? "task-item-active" : "",
        task.completed ? "task-item-completed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          disabled={isTimerRunning}
          aria-label={`Mark ${task.title} as done`}
          onChange={() => onToggle(task.id)}
        />
      </label>

      <button
        type="button"
        className="task-select"
        disabled={isTimerRunning || task.completed}
        onClick={() => onSelect(task.id)}
      >
        <span className={task.completed ? "task-title-completed" : ""}>
          {task.title}
        </span>
      </button>

      {isActive && !task.completed && (
        <span className="task-active-badge">In Progress</span>
      )}

      <button
        type="button"
        className="task-delete-button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        ×
      </button>
    </li>
  );
}

export default TaskItem;
