import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [reload, setReload] = useState(false);
  const refreshTasks = () => setReload(!reload);

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <div className="app-header fade-in">
          <div className="app-icon">
            <img src="logo.png" alt="NeuroTask AI Logo" className="app-logo" />
          </div>
          <h1 className="app-title">NeuroTask AI</h1>
          <p className="app-subtitle">
            Gestiona tus tareas de forma inteligente y eficiente
          </p>
        </div>

        {/* Contenido principal */}
        <TaskForm onTaskCreated={refreshTasks} />
        <TaskList key={reload} />
      </div>
    </div>
  );
}

export default App;
