import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка регистрации");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Регистрация</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Логин"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.button} type="submit">Зарегистрироваться</button>
        </form>
        <p style={styles.link}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5" },
  card: { background: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", width: "340px" },
  title: { margin: "0 0 1.5rem", textAlign: "center", color: "#333" },
  error: { color: "#e53e3e", fontSize: "0.875rem", marginBottom: "1rem" },
  input: { display: "block", width: "100%", padding: "0.6rem 0.8rem", marginBottom: "1rem", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "1rem", boxSizing: "border-box" },
  button: { width: "100%", padding: "0.7rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" },
  link: { textAlign: "center", marginTop: "1rem", fontSize: "0.875rem" },
};
