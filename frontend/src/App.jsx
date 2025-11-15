import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Exams from './pages/Exams'
import ExamDetail from './pages/ExamDetail'
import ExamAttempt from './pages/ExamAttempt'
import Consultations from './pages/Consultations'
import ConsultationDetail from './pages/ConsultationDetail'
import Videos from './pages/Videos'
import Notes from './pages/Notes'
import Forum from './pages/Forum'
import Fields from './pages/Fields'
import FieldDetail from './pages/FieldDetail'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:id" element={<ExamDetail />} />
            <Route 
              path="/exams/:id/attempt/:attemptId" 
              element={<PrivateRoute><ExamAttempt /></PrivateRoute>} 
            />
            <Route 
              path="/consultations" 
              element={<PrivateRoute><Consultations /></PrivateRoute>} 
            />
            <Route 
              path="/consultations/:id" 
              element={<PrivateRoute><ConsultationDetail /></PrivateRoute>} 
            />
            <Route path="/videos" element={<Videos />} />
            <Route path="/notes" element={<Notes />} />
            <Route 
              path="/forum" 
              element={<PrivateRoute><Forum /></PrivateRoute>} 
            />
            <Route path="/fields" element={<Fields />} />
            <Route path="/fields/:id" element={<FieldDetail />} />
            <Route 
              path="/profile" 
              element={<PrivateRoute><Profile /></PrivateRoute>} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App

