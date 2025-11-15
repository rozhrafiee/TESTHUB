import { useState, useEffect } from 'react'
import { videosAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Videos.css'

const Videos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
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

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="videos-page">
      <h1>ویدیوهای آموزشی</h1>
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

