import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [tasksRes, meRes] = await Promise.all([
        api.get("/tasks/"),
        api.get("/users/me"),
      ]);
      setTasks(tasksRes.data);
      setUsername(meRes.data.username);
    } catch {
      // 401 handled by interceptor → redirect to /login
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const { data } = await api.post("/tasks/", { title: newTitle, description: newDesc });
    setTasks([data, ...tasks]);
    setNewTitle("");
    setNewDesc("");
  };

  const toggleComplete = async (task) => {
    const { data } = await api.patch(`/tasks/${task.id}`, { completed: !task.completed });
    setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Мои задачи</h2>
        <div style={styles.user}>
          <span>{username}</span>
          <button onClick={logout} style={styles.logoutBtn}>Выйти</button>
        </div>
      </div>

      {/* Add task form */}
      <form onSubmit={addTask} style={styles.form}>
        <input
          style={{ ...styles.input, flex: 2 }}
          placeholder="Название задачи"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <input
          style={{ ...styles.input, flex: 3 }}
          placeholder="Описание (необязательно)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <button style={styles.addBtn} type="submit">+ Добавить</button>
      </form>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p style={styles.empty}>Нет задач. Добавьте первую!</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((task) => (
            <li key={task.id} style={styles.item}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                style={styles.checkbox}
              />
              <div style={styles.taskBody}>
                <span style={{ ...styles.taskTitle, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#9ca3af" : "#111" }}>
                  {task.title}
                </span>
                {task.description && (
                  <span style={styles.taskDesc}>{task.description}</span>
                )}
              </div>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteBtn}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "2rem auto", padding: "0 1rem", fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  title: { margin: 0, color: "#111" },
  user: { display: "flex", alignItems: "center", gap: "0.75rem", color: "#555" },
  logoutBtn: { padding: "0.4rem 0.8rem", background: "#e5e7eb", border: "none", borderRadius: "4px", cursor: "pointer" },
  form: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  input: { padding: "0.6rem 0.8rem", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.95rem" },
  addBtn: { padding: "0.6rem 1rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap" },
  list: { listStyle: "none", margin: 0, padding: 0 },
  item: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", marginBottom: "0.5rem" },
  checkbox: { width: "18px", height: "18px", cursor: "pointer", flexShrink: 0 },
  taskBody: { flex: 1, display: "flex", flexDirection: "column" },
  taskTitle: { fontSize: "1rem", fontWeight: 500 },
  taskDesc: { fontSize: "0.825rem", color: "#6b7280", marginTop: "2px" },
  deleteBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: "1rem", cursor: "pointer", padding: "0 4px" },
  loading: { textAlign: "center", marginTop: "5rem", color: "#555" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: "3rem" },
};
