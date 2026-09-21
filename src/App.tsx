import "./App.css";
import Header from "./components/Header/Header";
import TaskList from "./components/Tasks/TaskList";
import Timer from "./components/Timer/Timer";
import { useTasks } from "./hooks/useTasks";

function App() {
  const {
    tasks,
    activeTask,
    activeTaskId,
    addTask,
    selectTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  return (
    <div className="app">
      <Header />

      <Timer activeTask={activeTask} />

      <TaskList
        tasks={tasks}
        activeTaskId={activeTaskId}
        onAddTask={addTask}
        onSelectTask={selectTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
