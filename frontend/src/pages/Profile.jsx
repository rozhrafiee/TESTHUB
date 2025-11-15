import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Profile.css'

const Profile = () => {
  const { user, loadUser } = useAuth()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      setFormData(response.data.user)
      if (response.data.profile) {
        setFormData({ ...response.data.user, ...response.data.profile })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      await authAPI.updateProfile(formData)
      setMessage('پروفایل با موفقیت به‌روزرسانی شد')
      if (loadUser) loadUser()
    } catch (error) {
      setMessage('خطا در به‌روزرسانی پروفایل')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="profile-page">
      <h1>پروفایل</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>نام کاربری</label>
          <input
            type="text"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>ایمیل</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>شماره تماس</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>تاریخ تولد</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date || ''}
            onChange={handleChange}
          />
        </div>
        {user?.user_type === 'student' && (
          <>
            <div className="form-group">
              <label>رشته تحصیلی</label>
              <input
                type="text"
                name="field_of_study"
                value={formData.field_of_study || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>مقطع تحصیلی</label>
              <input
                type="text"
                name="educational_level"
                value={formData.educational_level || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {user?.user_type === 'teacher' && (
          <>
            <div className="form-group">
              <label>تخصص</label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>بیوگرافی</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {user?.user_type === 'consultant' && (
          <>
            <div className="form-group">
              <label>تخصص</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>سال‌های تجربه</label>
              <input
                type="number"
                name="experience"
                value={formData.experience || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {message && (
          <div className={message.includes('موفقیت') ? 'success' : 'error'}>
            {message}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </form>
    </div>
  )
}

export default Profile

