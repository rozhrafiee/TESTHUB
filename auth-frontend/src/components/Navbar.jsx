import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <nav style={{ display: "flex", gap: 10, padding: 10, background: "#eee" }}>
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
      {isLoggedIn && <Link to="/profile">Profile</Link>}
      {isLoggedIn && <button onClick={logout}>Logout</button>}
    </nav>
  );
}
