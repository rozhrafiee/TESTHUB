import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="home">
      <div className="hero">
        <h1>به پلتفرم آموزشی TestHub خوش آمدید</h1>
        <p>پلتفرم جامع برای آمادگی کنکور</p>
        {!isAuthenticated && (
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">ثبت نام</Link>
            <Link to="/login" className="btn btn-secondary">ورود</Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>آزمون‌های آزمایشی</h3>
          <p>شرکت در آزمون‌های چهارگزینه‌ای و ارتقای سطح</p>
          <Link to="/exams" className="btn btn-primary">مشاهده آزمون‌ها</Link>
        </div>
        <div className="feature-card">
          <h3>ویدیوهای آموزشی</h3>
          <p>دسترسی به ویدیوهای آموزشی اساتید</p>
          <Link to="/videos" className="btn btn-primary">مشاهده ویدیوها</Link>
        </div>
        <div className="feature-card">
          <h3>جزوات PDF</h3>
          <p>دانلود و اشتراک‌گذاری جزوات</p>
          <Link to="/notes" className="btn btn-primary">مشاهده جزوات</Link>
        </div>
        <div className="feature-card">
          <h3>اطلاعات رشته‌ها</h3>
          <p>آشنایی با رشته‌های مختلف و شرایط کنکور</p>
          <Link to="/fields" className="btn btn-primary">مشاهده رشته‌ها</Link>
        </div>
      </div>
    </div>
  )
}

export default Home

