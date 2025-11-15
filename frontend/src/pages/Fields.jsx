import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fieldsAPI } from '../services/api'
import './Fields.css'

const Fields = () => {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFields()
  }, [])

  const loadFields = async () => {
    try {
      const response = await fieldsAPI.list()
      setFields(response.data)
    } catch (error) {
      console.error('Error loading fields:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>
  }

  return (
    <div className="fields-page">
      <h1>اطلاعات رشته‌ها</h1>
      <div className="fields-grid">
        {fields.map((field) => (
          <Link key={field.id} to={`/fields/${field.id}`} className="field-card">
            <h3>{field.title}</h3>
            <p>{field.description.substring(0, 150)}...</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Fields

