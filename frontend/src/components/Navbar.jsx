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
      <div className="navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.png"
              alt=""
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <span>TestHub</span>
          </div>
        </Link>

        <div className="navbar-links" style={{ display: 'flex', gap: '12px', flexDirection: 'row-reverse', alignItems: 'center' }}>
          
          {!isAuthenticated && (
            <>
              <Link to="/">خانه</Link>
              <Link to="/register">ثبت‌نام</Link>
              <Link to="/login">ورود</Link>
            </>
          )}

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

          <Link to="/exams">آزمون‌ها</Link>
          <Link to="/videos">ویدیوها</Link>
          <Link to="/notes">جزوات</Link>
          <Link to="/fields">رشته‌ها</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
