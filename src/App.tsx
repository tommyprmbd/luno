import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import TaskList from "./components/Tasks/TaskList";
import Timer from "./components/Timer/Timer";
import { useTasks } from "./hooks/useTasks";
import { useTimer } from "./hooks/useTimer";
import type { TimerMode } from "./types/timer";

function App() {
  const {
    mode,
    status,
    remainingSeconds,
    completedPomodoros,
    start,
    pause,
    reset,
    changeMode,
  } = useTimer();

  const {
    tasks,
    activeTask,
    activeTaskId,
    addTask,
    selectTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  useEffect(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const modeLabels = {
      pomodoro: "Pomodoro",
      "short-break": "Short Break",
      "long-break": "Long Break",
    };

    document.title = `${formattedTime} - ${modeLabels[mode]} | Luno`;
  }, [remainingSeconds, mode]);

  function handleSelectTask(id: string) {
    if (status === "running") {
      return;
    }

    selectTask(id);
  }

  function handleToggleTask(id: string) {
    if (status === "running") {
      return;
    }

    toggleTask(id);
  }

  function handleChangeMode(newMode: TimerMode) {
    if (status === "running") {
      return;
    }

    changeMode(newMode);
  }

  return (
    <div className="app">
      <Header />

      <Timer
        activeTask={activeTask}
        mode={mode}
        status={status}
        remainingSeconds={remainingSeconds}
        completedPomodoros={completedPomodoros}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onChangeMode={handleChangeMode}
      />

      <TaskList
        tasks={tasks}
        activeTaskId={activeTaskId}
        isTimerRunning={status === "running"}
        onAddTask={addTask}
        onSelectTask={handleSelectTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
