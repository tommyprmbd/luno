import { useState } from "react";
import TaskItem from "./TaskItem";

const tasks = [
  {
    id: 1,
    title: "Learn React",
  },
  {
    id: 2,
    title: "Build Luno",
  },
];

function TaskList() {
  const [taskTitle, setTaskTitle] = useState("");

  return (
    <section className="tasks">
      <h2>Tasks</h2>

      <input
        type="text"
        value={taskTitle}
        onChange={(event) => setTaskTitle(event.target.value)}
        placeholder="What are you working on?"
      />

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} title={task.title} />
        ))}
      </div>

      <button className="add-task-button">+ Add Task</button>
    </section>
  );
}
export default TaskList;
