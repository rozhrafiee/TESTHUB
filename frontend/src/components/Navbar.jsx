import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
  const {
    isAuthenticated,
    user,
    logout,
    isAdmin,
    isStudent,
    isConsultant
  } = useAuth()

  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(
    document.body.classList.contains('dark')
  )

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark')
    setIsDark(prev => !prev)
  }

  const closeMenu = () => setMenuOpen(false)

  const isTeacher = user?.user_type === 'teacher'

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src="/logo.png" alt="logo" />
          <span>TestHub</span>
        </Link>

        {/* Hamburger */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          ☰
        </button>

        {/* Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>

          {/* ================= Guest ================= */}
          {!isAuthenticated && (
            <>
              <Link to="/" onClick={closeMenu}>خانه</Link>
              <Link to="/exams" onClick={closeMenu}>آزمون‌ها</Link>
              <Link to="/videos" onClick={closeMenu}>ویدیوها</Link>
              <Link to="/fields" onClick={closeMenu}>رشته‌ها</Link>
              <Link to="/register" onClick={closeMenu}>ثبت‌نام</Link>
              <Link to="/login" onClick={closeMenu}>ورود</Link>
            </>
          )}

          {/* ================= Student ================= */}
          {isAuthenticated && isStudent && (
            <>
              <Link to="/" onClick={closeMenu}>خانه</Link>
              <Link to="/exams" onClick={closeMenu}>آزمون‌ها</Link>
              <Link to="/videos" onClick={closeMenu}>ویدیوها</Link>
              <Link to="/notes" onClick={closeMenu}>جزوات</Link>
              <Link to="/consultations" onClick={closeMenu}>مشاوره</Link>
              <Link to="/forum" onClick={closeMenu}>انجمن</Link>
              <Link to="/profile" onClick={closeMenu}>پروفایل</Link>
            </>
          )}

          {/* ================= Teacher ================= */}
          {isAuthenticated && isTeacher && (
            <>
              <Link to="/" onClick={closeMenu}>خانه</Link>
              <Link to="/exams" onClick={closeMenu}>آزمون‌ها</Link>
              <Link to="/videos" onClick={closeMenu}>ویدیوها</Link>
              <Link to="/notes" onClick={closeMenu}>جزوات</Link>
              <Link to="/profile" onClick={closeMenu}>پروفایل</Link>
            </>
          )}

          {/* ================= Consultant ================= */}
          {isAuthenticated && isConsultant && (
            <>
              <Link to="/" onClick={closeMenu}>خانه</Link>
              <Link to="/exams" onClick={closeMenu}>آزمون‌ها</Link>
              <Link to="/videos" onClick={closeMenu}>ویدیوها</Link>
              <Link to="/notes" onClick={closeMenu}>جزوات</Link>
              <Link to="/consultations" onClick={closeMenu}>مشاوره‌ها</Link>
              <Link to="/profile" onClick={closeMenu}>پروفایل</Link>
            </>
          )}

          {/* ================= Admin ================= */}
          {isAdmin && (
            <Link to="/admin" className="admin-link" onClick={closeMenu}>
              مدیریت
            </Link>
          )}

          {/* Logout */}
          {isAuthenticated && (
            <button onClick={handleLogout} className="btn btn-secondary">
              خروج
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            className="dark-toggle"
            onClick={toggleDarkMode}
            title={isDark ? 'حالت روشن' : 'حالت تیره'}
          >
            {isDark ? '🌙' : '☀️'}
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
