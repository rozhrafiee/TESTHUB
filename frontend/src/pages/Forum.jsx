import { useState, useEffect, useRef } from 'react'
import { forumAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Forum.css'

const Forum = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      const response = await forumAPI.getMessages()
      setMessages(response.data.reverse()) // Show newest first
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await forumAPI.sendMessage(newMessage)
      setNewMessage('')
      loadMessages()
    } catch (error) {
      alert(error.response?.data?.error || 'خطا در ارسال پیام')
    }
  }

  const handleDelete = async (messageId) => {
    if (!window.confirm('آیا مطمئن هستید؟')) return

    try {
      await forumAPI.deleteMessage(messageId)
      loadMessages()
    } catch (error) {
      alert(error.response?.data?.error || 'خطا در حذف پیام')
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="forum-page">
      <h1>انجمن دانشجویان</h1>
      <div className="forum-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender.id === user?.id ? 'own' : ''}`}
            >
              <div className="message-header">
                <strong>{message.sender.username}</strong>
                <span className="message-time">
                  {new Date(message.created_at).toLocaleString('fa-IR')}
                </span>
                {message.sender.id === user?.id && (
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="btn-delete"
                  >
                    حذف
                  </button>
                )}
              </div>
              <div className="message-text">{message.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="message-form">
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
  )
}

export default Forum

