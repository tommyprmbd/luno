import { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import AboutModal from "./components/About/AboutModal";
import CompletionAlert from "./components/Timer/CompletionAlert";
import HistoryModal from "./components/History/HistoryModal";
import SettingsModal from "./components/Settings/SettingsModal";
import TaskList from "./components/Tasks/TaskList";
import Timer from "./components/Timer/Timer";
import { createDotBackdrop } from "./backdrop";
import { SESSION_COMPLETE_COPY } from "./constants/timer";
import { useNotifications } from "./hooks/useNotifications";
import { useSessions } from "./hooks/useSessions";
import { useTasks } from "./hooks/useTasks";
import { useTimer } from "./hooks/useTimer";
import type { CompletedSession } from "./types/session";
import type { TimerMode, TimerSettings } from "./types/timer";

const BACKDROP_STYLE = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(createDotBackdrop())}")`,
};

function App() {
  const {
    mode,
    status,
    remainingSeconds,
    completedPomodoros,
    lastCompletedSession,
    longBreakInterval,
    start,
    pause,
    reset,
    changeMode,
    settings,
    updateSettings,
  } = useTimer();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(
    null,
  );

  const {
    tasks,
    activeTask,
    activeTaskId,
    addTask,
    selectTask,
    toggleTask,
    deleteTask,
    incrementTaskPomodoro,
  } = useTasks();

  const { sessions, addSession } = useSessions();
  const {
    permission: notificationPermission,
    requestPermission,
    notifySessionComplete,
  } = useNotifications();

  const handledSession = useRef<CompletedSession | null>(null);

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

  useEffect(() => {
    if (
      !lastCompletedSession ||
      lastCompletedSession === handledSession.current
    ) {
      return;
    }

    handledSession.current = lastCompletedSession;

    if (lastCompletedSession.mode === "pomodoro" && activeTaskId) {
      incrementTaskPomodoro(activeTaskId);
    }

    addSession({
      ...lastCompletedSession,
      taskTitle:
        lastCompletedSession.mode === "pomodoro"
          ? (activeTask?.title ?? null)
          : null,
    });

    notifySessionComplete(lastCompletedSession);

    const { title, body } = SESSION_COMPLETE_COPY[lastCompletedSession.mode];

    setCompletionMessage(`${title}. ${body}`);
  }, [
    lastCompletedSession,
    activeTaskId,
    activeTask,
    incrementTaskPomodoro,
    addSession,
    notifySessionComplete,
  ]);

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

  function handleStart() {
    setCompletionMessage(null);
    start();
  }

  function handleChangeMode(newMode: TimerMode) {
    if (status === "running") {
      return;
    }

    setCompletionMessage(null);
    changeMode(newMode);
  }

  function handleSaveSettings(nextSettings: TimerSettings) {
    updateSettings(nextSettings);
    setIsSettingsOpen(false);
  }

  return (
    <main className="app">
      <div className="backdrop" aria-hidden="true" style={BACKDROP_STYLE} />

      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <Timer
        activeTask={activeTask}
        mode={mode}
        status={status}
        remainingSeconds={remainingSeconds}
        completedPomodoros={completedPomodoros}
        longBreakInterval={longBreakInterval}
        onStart={handleStart}
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

      <footer className="footer">
        <p className="footer-label">
          <span className="footer-dot" aria-hidden="true" />
          Ritual Guidance
        </p>
        <p className="footer-quote">
          “One breath. One task. In stillness, deep clarity surfaces
          effortlessly.”
        </p>
      </footer>

      {isHistoryOpen && (
        <HistoryModal
          sessions={sessions}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          notificationPermission={notificationPermission}
          onEnableNotifications={requestPermission}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}

      {completionMessage && (
        <CompletionAlert
          message={completionMessage}
          onClose={() => setCompletionMessage(null)}
        />
      )}
    </main>
  );
}

export default App;
