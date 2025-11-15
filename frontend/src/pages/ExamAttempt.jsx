import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { examsAPI } from '../services/api'
import './ExamAttempt.css'

const ExamAttempt = () => {
  const { id, attemptId } = useParams()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState(null)
  const [exam, setExam] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadAttempt()
  }, [attemptId])

  useEffect(() => {
    if (exam && timeLeft !== null && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [exam, timeLeft, submitted])

  const loadAttempt = async () => {
    try {
      const response = await examsAPI.getAttemptDetail(attemptId)
      const attemptData = response.data.attempt
      const examData = attemptData.exam
      
      setAttempt(attemptData)
      setExam(examData)
      
      // Initialize answers from existing answers
      const existingAnswers = {}
      if (attemptData.answers) {
        attemptData.answers.forEach((ans) => {
          existingAnswers[ans.question] = ans.selected_answer
        })
      }
      setAnswers(existingAnswers)

      // Calculate time left
      if (examData) {
        const startTime = new Date(attemptData.started_at)
        const endTime = new Date(startTime.getTime() + examData.duration_minutes * 60000)
        const now = new Date()
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
        setTimeLeft(remaining)
      }
    } catch (error) {
      console.error('Error loading attempt:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmitAnswer = async (questionId) => {
    try {
      await examsAPI.submitAnswer(attemptId, {
        question: questionId,
        selected_answer: answers[questionId],
      })
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const handleSubmit = async () => {
    if (submitted) return

    // Submit all answers
    for (const [questionId, answer] of Object.entries(answers)) {
      await handleSubmitAnswer(questionId)
    }

    try {
      const response = await examsAPI.submitExam(attemptId)
      setSubmitted(true)
      alert(`آزمون با موفقیت ارسال شد. نمره شما: ${response.data.score.toFixed(2)}%`)
      navigate('/exams')
    } catch (error) {
      console.error('Error submitting exam:', error)
      alert('خطا در ارسال آزمون')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !exam) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  if (submitted || attempt.completed) {
    return (
      <div className="exam-completed">
        <h2>آزمون تکمیل شد</h2>
        <p>در حال محاسبه نتایج...</p>
      </div>
    )
  }

  const question = exam.questions[currentQuestion]

  return (
    <div className="exam-attempt">
      <div className="exam-header">
        <h2>{exam.title}</h2>
        <div className="timer">
          زمان باقیمانده: {timeLeft !== null ? formatTime(timeLeft) : '...'}
        </div>
      </div>

      <div className="question-navigation">
        {exam.questions.map((q, index) => (
          <button
            key={q.id}
            className={`question-nav-btn ${index === currentQuestion ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="question-card">
        <div className="question-header">
          <h3>سوال {currentQuestion + 1} از {exam.questions.length}</h3>
        </div>
        <div className="question-text">{question.text}</div>
        <div className="options">
          {['A', 'B', 'C', 'D'].map((option) => (
            <label key={option} className="option-label">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={answers[question.id] === option}
                onChange={() => {
                  handleAnswerChange(question.id, option)
                  handleSubmitAnswer(question.id)
                }}
              />
              <span className="option-letter">{option}</span>
              <span className="option-text">{question[`option_${option.toLowerCase()}`]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="exam-actions">
        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="btn btn-secondary"
          >
            قبلی
          </button>
        )}
        {currentQuestion < exam.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="btn btn-primary"
          >
            بعدی
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-success">
            ارسال پاسخ‌ها
          </button>
        )}
      </div>
    </div>
  )
}

export default ExamAttempt

