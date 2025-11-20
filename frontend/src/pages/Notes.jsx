import { useState, useEffect } from 'react'
import { notesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Notes.css'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    field: '',
    file: null,
    is_paid: false,
    price: '',
  })
  const { isAuthenticated, isTeacher, isStudent } = useAuth()

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

  const handleUploadChange = (e) => {
    const { name, value, files, type, checked } = e.target
    if (files) {
      setUploadForm((prev) => ({ ...prev, [name]: files[0] }))
    } else if (type === 'checkbox') {
      setUploadForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setUploadForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!uploadForm.title || !uploadForm.file) {
      setUploadError('عنوان و فایل جزوه الزامی هستند')
      return
    }
    setUploading(true)
    setUploadError('')
    setUploadMessage('')
    try {
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      if (uploadForm.field) {
        formData.append('field', uploadForm.field)
      }
      formData.append('file', uploadForm.file)

      if (isTeacher) {
        formData.append('is_paid', uploadForm.is_paid ? 'true' : 'false')
        if (uploadForm.is_paid && uploadForm.price) {
          formData.append('price', uploadForm.price)
        }
      }

      await notesAPI.upload(formData)
      setUploadMessage('جزوه با موفقیت ارسال شد و پس از تأیید نمایش داده می‌شود.')
      setUploadForm({
        title: '',
        description: '',
        field: '',
        file: null,
        is_paid: false,
        price: '',
      })
      loadNotes()
    } catch (error) {
      setUploadError(error.response?.data?.error || 'خطا در آپلود جزوه')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="notes-page">
      <h1>جزوات PDF</h1>

      {(isStudent || isTeacher) && (
        <div className="card upload-card">
          <h2>اشتراک‌گذاری جزوه</h2>
          <p className="upload-hint">
            دانشجویان فقط می‌توانند جزوه رایگان ارسال کنند. اساتید می‌توانند گزینه فروش را فعال کنند.
          </p>
          <form onSubmit={handleUploadSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="note-title">عنوان</label>
              <input
                id="note-title"
                type="text"
                name="title"
                value={uploadForm.title}
                onChange={handleUploadChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="note-description">توضیحات</label>
              <textarea
                id="note-description"
                name="description"
                value={uploadForm.description}
                onChange={handleUploadChange}
                placeholder="توضیحی کوتاه درباره جزوه"
              />
            </div>
            <div className="form-group">
              <label htmlFor="note-field">رشته (اختیاری)</label>
              <input
                id="note-field"
                type="text"
                name="field"
                value={uploadForm.field}
                onChange={handleUploadChange}
                placeholder="مثال: مهندسی کامپیوتر"
              />
            </div>
            <div className="form-group">
              <label htmlFor="note-file">فایل PDF</label>
              <input
                id="note-file"
                type="file"
                name="file"
                accept="application/pdf"
                onChange={handleUploadChange}
                required
              />
            </div>

            {isTeacher && (
              <div className="form-inline">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_paid"
                    checked={uploadForm.is_paid}
                    onChange={handleUploadChange}
                  />
                  جزوه پولی باشد
                </label>
                {uploadForm.is_paid && (
                  <input
                    type="number"
                    name="price"
                    placeholder="قیمت (تومان)"
                    min="0"
                    value={uploadForm.price}
                    onChange={handleUploadChange}
                    required
                  />
                )}
              </div>
            )}

            {uploadError && <div className="error">{uploadError}</div>}
            {uploadMessage && <div className="success">{uploadMessage}</div>}
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'در حال ارسال...' : 'ارسال جزوه'}
            </button>
          </form>
        </div>
      )}

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

