import { useState } from "react";
import { createTask, autoCompleteDescription } from "../services/api";

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await createTask({ title, description, status: "pending" });
      onTaskCreated();
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoComplete = async () => {
    if (!title.trim()) return;

    setIsAutoCompleting(true);
    try {
      const data = await autoCompleteDescription(title);
      setDescription(data.description);
    } catch (error) {
      console.error("Error auto-completing:", error);
    } finally {
      setIsAutoCompleting(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="section-indicator">
        <div className="indicator-bar"></div>
        <h2 className="section-title">Nueva Tarea</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campo de título */}
        <div className="form-group">
          <label className="form-label">Título de la tarea</label>
          <input
            type="text"
            className="form-input"
            placeholder="¿Qué necesitas hacer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Campo de descripción */}
        <div className="form-group">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <label className="form-label" style={{ margin: 0 }}>
              Descripción
            </label>
            {title && (
              <button
                type="button"
                onClick={handleAutoComplete}
                disabled={isAutoCompleting}
                className="btn btn-secondary btn-small"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  color: "white",
                  border: "none",
                }}
              >
                {isAutoCompleting ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: "12px", height: "12px" }}
                    ></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    AI Autocompletar
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            className="form-textarea"
            placeholder="Describe los detalles de tu tarea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="btn btn-primary"
          style={{ opacity: isLoading || !title.trim() ? 0.5 : 1 }}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Creando tarea...
            </>
          ) : (
            <>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Tarea
            </>
          )}
        </button>
      </form>
    </div>
  );
}
