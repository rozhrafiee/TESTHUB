import { useState } from "react";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    user_type: "student",
    phone: "",
    birth_date: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    API.post("register/", form)
      .then(res => {
        alert("Registered!");
        localStorage.setItem("token", res.data.token);
      })
      .catch(err => console.error(err.response?.data));
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Register</h2>

      <input placeholder="username" value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })} />

      <input placeholder="email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />

      <input placeholder="phone" value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })} />

      <input placeholder="YYYY-MM-DD" value={form.birth_date}
        onChange={e => setForm({ ...form, birth_date: e.target.value })} />

      <select
        value={form.user_type}
        onChange={e => setForm({ ...form, user_type: e.target.value })}
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="consultant">Consultant</option>
      </select>

      <input type="password" placeholder="password1" value={form.password1}
        onChange={e => setForm({ ...form, password1: e.target.value })} />

      <input type="password" placeholder="password2" value={form.password2}
        onChange={e => setForm({ ...form, password2: e.target.value })} />

      <button type="submit">Sign Up</button>
    </form>
  );
}
