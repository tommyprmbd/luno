import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import TaskList from "./components/Tasks/TaskList";
import Timer from "./components/Timer/Timer";
import type { Task } from "./types/task";

function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  return (
    <div className="app">
      <Header />
      
      <Timer activeTask={activeTask} />

      <TaskList
        activeTaskId={activeTask?.id ?? null}
        onSelectTask={setActiveTask}
        onActiveTaskRemoved={() => setActiveTask(null)}
      />
    </div>
  );
}

export default App;
