import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          TestHub
        </Link>
        <div className="navbar-links">
          <Link to="/exams">آزمون‌ها</Link>
          <Link to="/videos">ویدیوها</Link>
          <Link to="/notes">جزوات</Link>
          <Link to="/fields">رشته‌ها</Link>
          {isAuthenticated && (
            <>
              {user?.user_type === 'student' && (
                <>
                  <Link to="/consultations">مشاوره</Link>
                  <Link to="/forum">انجمن</Link>
                </>
              )}
              {(user?.user_type === 'teacher' || user?.user_type === 'consultant') && (
                <Link to="/consultations">مشاوره‌ها</Link>
              )}
              <Link to="/profile">پروفایل</Link>
              {isAdmin && (
                <Link to="/admin" className="admin-link">مدیریت</Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary">
                خروج
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login">ورود</Link>
              <Link to="/register">ثبت نام</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

