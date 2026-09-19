type TaskItemProps = {
  title: string;
};

function TaskItem({ title }: TaskItemProps) {
  return (
    <div className="task-item">
      <span>○</span>
      <span>{title}</span>
    </div>
  );
}

export default TaskItem
