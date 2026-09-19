import "./App.css";
import Header from "./components/Header/Header";
import TaskList from "./components/Tasks/TaskList";
import Timer from "./components/Timer/Timer";

function App() {
  return (
    <div className="app">
      <Header />
      <Timer />
      <TaskList />
    </div>
  );
}

export default App;
