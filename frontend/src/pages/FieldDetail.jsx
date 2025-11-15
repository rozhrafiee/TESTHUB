import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fieldsAPI } from '../services/api'
import './FieldDetail.css'

const FieldDetail = () => {
  const { id } = useParams()
  const [field, setField] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadField()
  }, [id])

  const loadField = async () => {
    try {
      const response = await fieldsAPI.getDetail(id)
      setField(response.data)
    } catch (error) {
      console.error('Error loading field:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  if (!field) {
    return <div className="error">رشته یافت نشد</div>
  }

  return (
    <div className="field-detail">
      <Link to="/fields" className="back-link">← بازگشت به لیست رشته‌ها</Link>
      <h1>{field.title}</h1>
      <div className="field-content">
        <section>
          <h2>توضیحات</h2>
          <p>{field.description}</p>
        </section>
        <section>
          <h2>اطلاعات کنکور</h2>
          <p>{field.exam_info}</p>
        </section>
        <section>
          <h2>دروس</h2>
          <p>{field.subjects}</p>
        </section>
        {field.career_opportunities && (
          <section>
            <h2>فرصت‌های شغلی</h2>
            <p>{field.career_opportunities}</p>
          </section>
        )}
      </div>
    </div>
  )
}

export default FieldDetail

