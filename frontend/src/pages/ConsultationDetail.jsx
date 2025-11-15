import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { consultationsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './ConsultationDetail.css'

const ConsultationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [consultation, setConsultation] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [newSchedule, setNewSchedule] = useState({
    day: 'monday',
    time: '',
    activity: '',
    week_start_date: '',
  })
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const { isConsultant, isStudent } = useAuth()

  useEffect(() => {
    loadData()
    const interval = setInterval(() => {
      loadMessages()
    }, 3000)
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadData = async () => {
    await Promise.all([loadConsultation(), loadSchedules(), loadMessages()])
    setLoading(false)
  }

  const loadConsultation = async () => {
    try {
      const response = await consultationsAPI.getMyConsultations()
      const found = response.data.find((c) => c.id === parseInt(id))
      setConsultation(found)
    } catch (error) {
      console.error('Error loading consultation:', error)
    }
  }

  const loadSchedules = async () => {
    try {
      const response = await consultationsAPI.getSchedules(id)
      setSchedules(response.data)
    } catch (error) {
      console.error('Error loading schedules:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await consultationsAPI.getMessages(id)
      setMessages(response.data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await consultationsAPI.sendMessage(id, newMessage)
      setNewMessage('')
      loadMessages()
    } catch (error) {
      alert(error.response?.data?.error || 'خطا در ارسال پیام')
    }
  }

  const handleCreateSchedule = async (e) => {
    e.preventDefault()
    try {
      await consultationsAPI.createSchedule(id, newSchedule)
      setNewSchedule({
        day: 'monday',
        time: '',
        activity: '',
        week_start_date: '',
      })
      loadSchedules()
    } catch (error) {
      alert(error.response?.data?.error || 'خطا در ایجاد برنامه')
    }
  }

  const handleEndConsultation = async () => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این مشاوره را پایان دهید؟')) return

    try {
      await consultationsAPI.endConsultation(id)
      navigate('/consultations')
    } catch (error) {
      alert(error.response?.data?.error || 'خطا در پایان مشاوره')
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  if (!consultation) {
    return <div className="error">مشاوره یافت نشد</div>
  }

  return (
    <div className="consultation-detail">
      <div className="consultation-header">
        <h1>
          مشاوره با{' '}
          {isStudent
            ? consultation.consultant.username
            : consultation.student.username}
        </h1>
        {isStudent && (
          <button onClick={handleEndConsultation} className="btn btn-danger">
            پایان مشاوره
          </button>
        )}
      </div>

      <div className="consultation-content">
        <div className="schedules-section">
          <h2>برنامه هفتگی</h2>
          {isConsultant && (
            <form onSubmit={handleCreateSchedule} className="schedule-form">
              <div className="form-row">
                <div className="form-group">
                  <label>روز هفته</label>
                  <select
                    value={newSchedule.day}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, day: e.target.value })
                    }
                    required
                  >
                    <option value="monday">دوشنبه</option>
                    <option value="tuesday">سه‌شنبه</option>
                    <option value="wednesday">چهارشنبه</option>
                    <option value="thursday">پنج‌شنبه</option>
                    <option value="friday">جمعه</option>
                    <option value="saturday">شنبه</option>
                    <option value="sunday">یکشنبه</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>زمان</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>تاریخ شروع هفته</label>
                  <input
                    type="date"
                    value={newSchedule.week_start_date}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, week_start_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>فعالیت</label>
                <textarea
                  value={newSchedule.activity}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, activity: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                افزودن برنامه
              </button>
            </form>
          )}
          <div className="schedules-list">
            {schedules.length === 0 ? (
              <p>برنامه‌ای وجود ندارد</p>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-day">{schedule.day}</div>
                  <div className="schedule-time">{schedule.time}</div>
                  <div className="schedule-activity">{schedule.activity}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="messages-section">
          <h2>چت</h2>
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender.id === (isStudent ? consultation.student.id : consultation.consultant.id) ? 'own' : ''}`}
              >
                <div className="message-header">
                  <strong>{message.sender.username}</strong>
                  <span className="message-time">
                    {new Date(message.created_at).toLocaleString('fa-IR')}
                  </span>
                </div>
                <div className="message-text">{message.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="message-input"
            />
            <button type="submit" className="btn btn-primary">
              ارسال
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConsultationDetail

