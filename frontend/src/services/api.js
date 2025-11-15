import axios from 'axios'

// API Base URL - try both localhost and 127.0.0.1
const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
    } else if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error - No response from server:', error.request)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.put('/accounts/profile/', data),
}

// Exams API
export const examsAPI = {
  list: () => api.get('/exams/'),
  getDetail: (id) => api.get(`/exams/${id}/`),
  startExam: (id) => api.post(`/exams/${id}/start/`),
  submitAnswer: (attemptId, data) => api.post(`/exams/attempts/${attemptId}/answer/`, data),
  submitExam: (attemptId) => api.post(`/exams/attempts/${attemptId}/submit/`),
  getMyAttempts: () => api.get('/exams/my-attempts/'),
  getMyLevel: () => api.get('/exams/my-level/'),
  getAttemptDetail: (attemptId) => api.get(`/exams/attempts/${attemptId}/`),
}

// Consultations API
export const consultationsAPI = {
  listConsultants: () => api.get('/consultations/consultants/'),
  selectConsultant: (consultantId) => api.post('/consultations/select/', { consultant_id: consultantId }),
  getMyConsultations: () => api.get('/consultations/my-consultations/'),
  getSchedules: (consultationId) => api.get(`/consultations/${consultationId}/schedules/`),
  createSchedule: (consultationId, data) => api.post(`/consultations/${consultationId}/schedules/`, data),
  getMessages: (consultationId) => api.get(`/consultations/${consultationId}/messages/`),
  sendMessage: (consultationId, message) => api.post(`/consultations/${consultationId}/messages/`, { message }),
  endConsultation: (consultationId) => api.post(`/consultations/${consultationId}/end/`),
}

// Videos API
export const videosAPI = {
  list: () => api.get('/videos/'),
  getDetail: (id) => api.get(`/videos/${id}/`),
  upload: (formData) => api.post('/videos/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  approve: (id) => api.post(`/videos/${id}/approve/`),
}

// Notes API
export const notesAPI = {
  list: () => api.get('/notes/'),
  getDetail: (id) => api.get(`/notes/${id}/`),
  upload: (formData) => api.post('/notes/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  purchase: (id) => api.post(`/notes/${id}/purchase/`),
  getMyNotes: () => api.get('/notes/my-notes/'),
  getMyPurchases: () => api.get('/notes/my-purchases/'),
  approve: (id) => api.post(`/notes/${id}/approve/`),
}

// Forum API
export const forumAPI = {
  getMessages: () => api.get('/forums/messages/'),
  sendMessage: (message) => api.post('/forums/messages/', { message }),
  deleteMessage: (id) => api.delete(`/forums/messages/${id}/delete/`),
}

// Fields API
export const fieldsAPI = {
  list: () => api.get('/fields/'),
  getDetail: (id) => api.get(`/fields/${id}/`),
  getByName: (name) => api.get(`/fields/name/${name}/`),
}

export default api

