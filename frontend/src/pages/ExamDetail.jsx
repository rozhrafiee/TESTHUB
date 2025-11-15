import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { examsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './ExamDetail.css'

const ExamDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated, isStudent } = useAuth()

  useEffect(() => {
    loadExam()
  }, [id])

  const loadExam = async () => {
    try {
      const response = await examsAPI.getDetail(id)
      setExam(response.data)
    } catch (error) {
      setError(error.response?.data?.error || 'خطا در بارگذاری آزمون')
    } finally {
      setLoading(false)
    }
  }

  const handleStartExam = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      const response = await examsAPI.startExam(id)
      navigate(`/exams/${id}/attempt/${response.data.id}`)
    } catch (error) {
      setError(error.response?.data?.error || 'خطا در شروع آزمون')
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <Link to="/exams" className="btn btn-secondary">بازگشت به لیست آزمون‌ها</Link>
      </div>
    )
  }

  return (
    <div className="exam-detail">
      <h1>{exam.title}</h1>
      <p>{exam.description}</p>
      <div className="exam-info">
        <p><strong>رشته:</strong> {exam.field}</p>
        <p><strong>مدت زمان:</strong> {exam.duration_minutes} دقیقه</p>
        <p><strong>تعداد سوالات:</strong> {exam.questions.length}</p>
        {exam.required_level && (
          <p><strong>سطح مورد نیاز:</strong> {exam.required_level}</p>
        )}
      </div>
      {isAuthenticated && isStudent ? (
        <button onClick={handleStartExam} className="btn btn-primary btn-large">
          شروع آزمون
        </button>
      ) : (
        <div>
          <p className="info">برای شرکت در آزمون باید وارد شوید</p>
          <Link to="/login" className="btn btn-primary">ورود</Link>
        </div>
      )}
    </div>
  )
}

export default ExamDetail

