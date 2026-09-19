import "./App.css";
import Timer from "./components/Timer";

function App() {
  return (
    <main>
      <h1>Luno</h1>

      <Timer title="Pomodoro" minutes={25} />
    </main>
  );
}

export default App;
