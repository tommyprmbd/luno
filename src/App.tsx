import "./App.css";
import Header from "./components/Header/Header";
import TaskList from "./components/Tasks/TaskList";
import Timer from "./components/Timer/Timer";
import { useTasks } from "./hooks/useTasks";
import { useTimer } from "./hooks/useTimer";

function App() {
  const { mode, status, remainingSeconds, start, pause, reset, changeMode } =
    useTimer();

  const {
    tasks,
    activeTask,
    activeTaskId,
    addTask,
    selectTask,
    toggleTask,
    deleteTask,
  } = useTasks();

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

  return (
    <div className="app">
      <Header />

      <Timer
        activeTask={activeTask}
        mode={mode}
        status={status}
        remainingSeconds={remainingSeconds}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onChangeMode={changeMode}
      />

      <TaskList
        tasks={tasks}
        activeTaskId={activeTaskId}
        isTimerRunning={status === 'running'}
        onAddTask={addTask}
        onSelectTask={handleSelectTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
