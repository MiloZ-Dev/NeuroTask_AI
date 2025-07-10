import { useEffect, useState } from "react";
import EditTaskModal from "./EditTaskModal";
import {
  getTasks,
  updateTaskStatus,
  updateTask,
  getTasksByStatus,
  deleteTask,
} from "../services/api";

const statusConfig = {
  pending: {
    label: "Pendiente",
    className: "status-pending",
    icon: "⏳",
    gradient: "from-amber-500 to-orange-500",
  },
  in_progress: {
    label: "En Progreso",
    className: "status-in_progress",
    icon: "🚀",
    gradient: "from-blue-500 to-indigo-500",
  },
  completed: {
    label: "Completada",
    className: "status-completed",
    icon: "✅",
    gradient: "from-green-500 to-emerald-500",
  },
  canceled: {
    label: "Cancelada",
    className: "status-canceled",
    icon: "❌",
    gradient: "from-red-500 to-pink-500",
  },
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = filterStatus
        ? await getTasksByStatus(filterStatus)
        : await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await deleteTask(taskId);
        loadTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const openEditModal = (task) => {
    if (task) {
      setSelectedTask(task);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
      });
      setIsEditModalOpen(false);
      loadTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filterStatus]);

  const getFilteredTasks = () => {
    return filterStatus
      ? tasks.filter((task) => task.status === filterStatus)
      : tasks;
  };

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="section-indicator">
        <div className="indicator-bar"></div>
        <h2 className="section-title">Mis Tareas</h2>
        <span className="task-counter">{getFilteredTasks().length}</span>
      </div>

      {/* Filtros */}
      <div className="filter-container">
        <label className="form-label">Filtrar por estado</label>
        <div className="filter-buttons">
          <button
            onClick={() => setFilterStatus("")}
            className={`filter-btn ${filterStatus === "" ? "active" : ""}`}
          >
            Todas ({tasks.length})
          </button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = tasks.filter((task) => task.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`filter-btn ${
                  filterStatus === status ? "active" : ""
                }`}
              >
                {config.icon} {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de tareas */}
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <span>Cargando tareas...</span>
        </div>
      ) : getFilteredTasks().length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="#8b5cf6"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="empty-title">No hay tareas</h3>
          <p className="empty-description">
            {filterStatus
              ? "No hay tareas con este estado"
              : "Crea tu primera tarea para comenzar"}
          </p>
        </div>
      ) : (
        <div className="tasks-container">
          {getFilteredTasks().map((task) => {
            const statusInfo =
              statusConfig[task.status] || statusConfig.pending;
            return (
              <div key={task.id} className="task-card">
                {/* Encabezado de la tarea */}
                <div className="task-header">
                  <span className="task-icon">{statusInfo.icon}</span>
                  <h3 className="task-title">{task.title}</h3>
                  <span className={`task-status ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Descripción */}
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                {/* Controles */}
                <div className="task-controls">
                  <div className="task-status-control">
                    <label>Cambiar estado:</label>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                    >
                      {Object.entries(statusConfig).map(([status, config]) => (
                        <option key={status} value={status}>
                          {config.icon} {config.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => openEditModal(task)}
                      className="btn-icon btn-primary"
                      title="Editar tarea"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn-icon btn-danger"
                      title="Eliminar tarea"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}
