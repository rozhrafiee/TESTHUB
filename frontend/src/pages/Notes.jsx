import { useState, useEffect } from 'react'
import { notesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Notes.css'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const response = await notesAPI.list()
      setNotes(response.data)
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (noteId) => {
    try {
      await notesAPI.purchase(noteId)
      loadNotes() // Reload to update purchase status
    } catch (error) {
      alert(error.response?.data?.error || 'خطا در خرید')
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="notes-page">
      <h1>جزوات PDF</h1>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <div className="note-info">
              <span>آپلود کننده: {note.uploader}</span>
              {note.field && <span>رشته: {note.field}</span>}
              {note.is_paid && <span className="price">قیمت: {note.price} تومان</span>}
            </div>
            {note.is_paid ? (
              note.is_purchased ? (
                <a
                  href={`http://localhost:8000${note.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  دانلود
                </a>
              ) : (
                <button
                  onClick={() => handlePurchase(note.id)}
                  className="btn btn-primary"
                  disabled={!isAuthenticated}
                >
                  خرید
                </button>
              )
            ) : (
              <a
                href={`http://localhost:8000${note.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                دانلود رایگان
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notes

