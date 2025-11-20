import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { examsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Exams.css'

const Exams = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState(null)
  const { isAuthenticated, isStudent } = useAuth()

  useEffect(() => {
    loadExams()
    if (isAuthenticated && isStudent) {
      loadLevel()
    }
  }, [isAuthenticated, isStudent])

  const loadExams = async () => {
    try {
      const response = await examsAPI.list()
      setExams(response.data)
    } catch (error) {
      console.error('Error loading exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLevel = async () => {
    try {
      const response = await examsAPI.getMyLevel()
      setLevel(response.data.level)
    } catch (error) {
      console.error('Error loading level:', error)
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="exams-page">
      <h1>آزمون‌های آزمایشی</h1>
      {isAuthenticated && isStudent && level !== null && (
        <div className="level-badge">
          سطح شما: {level}
        </div>
      )}
      <div className="exams-grid">
        {exams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <h3>{exam.title}</h3>
            <p>{exam.description}</p>
            <div className="exam-info">
              <span>رشته: {exam.field}</span>
              <span>مدت زمان: {exam.duration_minutes} دقیقه</span>
              <span>سوالات: {exam.question_count}</span>
              {exam.required_level && (
                <span>سطح مورد نیاز: {exam.required_level}</span>
              )}
            </div>
            <Link to={`/exams/${exam.id}`} className="btn btn-primary">
              مشاهده آزمون
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Exams

