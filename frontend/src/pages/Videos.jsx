import { useState, useEffect } from 'react'
import { videosAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Videos.css'

const Videos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null,
    thumbnail: null,
  })
  const { isTeacher, isAdmin } = useAuth()

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const response = await videosAPI.list()
      setVideos(response.data)
    } catch (error) {
      console.error('Error loading videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setUploadForm((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setUploadForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!uploadForm.title || !uploadForm.file) {
      setUploadError('عنوان و فایل ویدیو الزامی هستند')
      return
    }
    setUploading(true)
    setUploadError('')
    setUploadMessage('')
    try {
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('file', uploadForm.file)
      if (uploadForm.thumbnail) {
        formData.append('thumbnail', uploadForm.thumbnail)
      }
      await videosAPI.upload(formData)
      setUploadMessage('ویدیو با موفقیت ارسال شد و پس از تأیید نمایش داده می‌شود.')
      setUploadForm({
        title: '',
        description: '',
        file: null,
        thumbnail: null,
      })
      loadVideos()
    } catch (error) {
      setUploadError(error.response?.data?.error || 'خطا در بارگذاری ویدیو')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="videos-page">
      <h1>ویدیوهای آموزشی</h1>

      {(isTeacher || isAdmin) && (
        <div className="card upload-card">
          <h2>آپلود ویدیو جدید</h2>
          <p className="upload-hint">ویدیو پس از تأیید مدیر نمایش داده خواهد شد.</p>
          <form onSubmit={handleUploadSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="video-title">عنوان</label>
              <input
                id="video-title"
                type="text"
                name="title"
                value={uploadForm.title}
                onChange={handleUploadChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="video-description">توضیحات</label>
              <textarea
                id="video-description"
                name="description"
                value={uploadForm.description}
                onChange={handleUploadChange}
                placeholder="توضیح کوتاه درباره ویدیو"
              />
            </div>
            <div className="form-group">
              <label htmlFor="video-file">فایل ویدیو (MP4)</label>
              <input
                id="video-file"
                type="file"
                name="file"
                accept="video/mp4,video/*"
                onChange={handleUploadChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="video-thumbnail">تصویر بندانگشتی (اختیاری)</label>
              <input
                id="video-thumbnail"
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleUploadChange}
              />
            </div>
            {uploadError && <div className="error">{uploadError}</div>}
            {uploadMessage && <div className="success">{uploadMessage}</div>}
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'در حال آپلود...' : 'آپلود ویدیو'}
            </button>
          </form>
        </div>
      )}

      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            {video.thumbnail && (
              <img src={`http://localhost:8000${video.thumbnail}`} alt={video.title} />
            )}
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <div className="video-info">
              <span>آپلود کننده: {video.uploader}</span>
              <span>تاریخ: {new Date(video.created_at).toLocaleDateString('fa-IR')}</span>
            </div>
            <video controls className="video-player">
              <source src={`http://localhost:8000${video.file}`} type="video/mp4" />
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Videos

