import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    API.post("login/", form)
      .then(res => {
        localStorage.setItem("token", res.data.token);
        navigate("/profile");
      })
      .catch(() => alert("Invalid credentials"));
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Login</h2>

      <input placeholder="username"
        onChange={e => setForm({ ...form, username: e.target.value })}
      />

      <input type="password" placeholder="password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button type="submit">Login</button>
    </form>
  );
}
