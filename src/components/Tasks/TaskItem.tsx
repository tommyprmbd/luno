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
    <li className={`task-item ${isActive ? "task-item-active" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          disabled={isTimerRunning}
          onChange={() => onToggle(task.id)}
        />

        <span>{task.title}</span>
      </label>

      {!task.completed && (
        <button
          type="button"
          disabled={isTimerRunning}
          onClick={() => onSelect(task.id)}
        >
          FOCUS
        </button>
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
