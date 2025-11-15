import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    user_type: 'student',
    phone: '',
    birth_date: '',
    // Student profile fields
    field_of_study: '',
    educational_level: '',
    // Teacher profile fields
    expertise: '',
    bio: '',
    // Consultant profile fields
    specialization: '',
    experience: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password1 !== formData.password2) {
      setError('رمزهای عبور مطابقت ندارند')
      return
    }

    setLoading(true)
    const result = await register(formData)
    
    if (result.success) {
      navigate('/')
    } else {
      console.error('Registration error:', result.error)
      if (typeof result.error === 'string') {
        setError(result.error)
      } else if (typeof result.error === 'object') {
        setError(JSON.stringify(result.error, null, 2))
      } else {
        setError('خطا در ثبت نام. لطفاً دوباره تلاش کنید.')
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>ثبت نام</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user_type">نوع کاربر</label>
            <select 
              id="user_type"
              name="user_type" 
              value={formData.user_type} 
              onChange={handleChange} 
              required
              title="نوع کاربر را انتخاب کنید"
            >
              <option value="student">دانشجو</option>
              <option value="teacher">استاد</option>
              <option value="consultant">مشاور</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="username">نام کاربری</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">ایمیل</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password1">رمز عبور</label>
            <input
              id="password1"
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">تکرار رمز عبور</label>
            <input
              id="password2"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">شماره تماس</label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>
          <div className="form-group">
            <label htmlFor="birth_date">تاریخ تولد</label>
            <input
              id="birth_date"
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              autoComplete="bday"
            />
          </div>

          {/* Student Profile Fields */}
          {formData.user_type === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="field_of_study">رشته تحصیلی</label>
                <input
                  id="field_of_study"
                  type="text"
                  name="field_of_study"
                  value={formData.field_of_study}
                  onChange={handleChange}
                  placeholder="مثال: مهندسی کامپیوتر"
                />
              </div>
              <div className="form-group">
                <label htmlFor="educational_level">مقطع تحصیلی</label>
                <input
                  id="educational_level"
                  type="text"
                  name="educational_level"
                  value={formData.educational_level}
                  onChange={handleChange}
                  placeholder="مثال: کارشناسی"
                />
              </div>
            </>
          )}

          {/* Teacher Profile Fields */}
          {formData.user_type === 'teacher' && (
            <>
              <div className="form-group">
                <label htmlFor="expertise">تخصص</label>
                <input
                  id="expertise"
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="مثال: ریاضیات، فیزیک"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">بیوگرافی</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="توضیحات درباره خود..."
                />
              </div>
            </>
          )}

          {/* Consultant Profile Fields */}
          {formData.user_type === 'consultant' && (
            <>
              <div className="form-group">
                <label htmlFor="specialization">تخصص</label>
                <input
                  id="specialization"
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="مثال: مشاوره تحصیلی"
                />
              </div>
              <div className="form-group">
                <label htmlFor="experience">سال‌های تجربه</label>
                <input
                  id="experience"
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="مثال: 5"
                  min="0"
                />
              </div>
            </>
          )}

          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
          </button>
        </form>
        <p className="auth-link">
          قبلاً ثبت نام کرده‌اید؟ <Link to="/login">وارد شوید</Link>
        </p>
      </div>
    </div>
  )
}

export default Register

