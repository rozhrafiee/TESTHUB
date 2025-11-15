import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { consultationsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Consultations.css'

const Consultations = () => {
  const [consultations, setConsultations] = useState([])
  const [consultants, setConsultants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSelect, setShowSelect] = useState(false)
  const { isStudent, isConsultant } = useAuth()

  useEffect(() => {
    if (isStudent) {
      loadConsultants()
    }
    loadConsultations()
  }, [isStudent])

  const loadConsultations = async () => {
    try {
      const response = await consultationsAPI.getMyConsultations()
      setConsultations(response.data)
    } catch (error) {
      console.error('Error loading consultations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadConsultants = async () => {
    try {
      const response = await consultationsAPI.listConsultants()
      setConsultants(response.data)
    } catch (error) {
      console.error('Error loading consultants:', error)
    }
  }

  const handleSelectConsultant = async (consultantId) => {
    try {
      await consultationsAPI.selectConsultant(consultantId)
      setShowSelect(false)
      loadConsultations()
    } catch (error) {
      alert(error.response?.data?.error || 'خطا در انتخاب مشاور')
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="consultations-page">
      <div className="consultations-header">
        <h1>مشاوره</h1>
        {isStudent && (
          <button onClick={() => setShowSelect(!showSelect)} className="btn btn-primary">
            {showSelect ? 'بستن' : 'انتخاب مشاور'}
          </button>
        )}
      </div>

      {showSelect && isStudent && (
        <div className="consultants-list">
          <h2>لیست مشاوران</h2>
          <div className="consultants-grid">
            {consultants.map((consultant) => (
              <div key={consultant.id} className="consultant-card">
                <h3>{consultant.username}</h3>
                <p>ایمیل: {consultant.email}</p>
                <button
                  onClick={() => handleSelectConsultant(consultant.id)}
                  className="btn btn-primary"
                >
                  انتخاب
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="consultations-list">
        {consultations.length === 0 ? (
          <div className="empty-state">
            {isStudent ? 'شما هنوز مشاوری انتخاب نکرده‌اید' : 'مشاوره‌ای وجود ندارد'}
          </div>
        ) : (
          consultations.map((consultation) => (
            <Link
              key={consultation.id}
              to={`/consultations/${consultation.id}`}
              className="consultation-card"
            >
              <h3>
                {isStudent
                  ? `مشاور: ${consultation.consultant.username}`
                  : `دانشجو: ${consultation.student.username}`}
              </h3>
              <p>تاریخ شروع: {new Date(consultation.created_at).toLocaleDateString('fa-IR')}</p>
              <span className={`status ${consultation.active ? 'active' : 'inactive'}`}>
                {consultation.active ? 'فعال' : 'غیرفعال'}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Consultations

