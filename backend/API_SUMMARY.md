# Backend API Summary

## ✅ All Features Implemented

### 1. Authentication & Authorization
- **Registration**: `POST /accounts/register/`
- **Login**: `POST /accounts/login/`
- **Profile**: `GET/PUT /accounts/profile/`
- **Role-based permissions**: Admin, Teacher, Student, Consultant

### 2. Exam Platform (`/exams/`)
- `GET /exams/` - List all exams
- `GET /exams/<id>/` - Get exam details with questions
- `POST /exams/<id>/start/` - Start exam attempt
- `POST /exams/attempts/<id>/answer/` - Submit answer
- `POST /exams/attempts/<id>/submit/` - Submit exam
- `GET /exams/my-attempts/` - Get student's attempts
- `GET /exams/my-level/` - Get student level
- `GET /exams/attempts/<id>/` - Get attempt results

### 3. Consultation System (`/consultations/`)
- `GET /consultations/consultants/` - List consultants
- `POST /consultations/select/` - Select consultant
- `GET /consultations/my-consultations/` - Get consultations
- `GET/POST /consultations/<id>/schedules/` - Weekly schedules
- `GET/POST /consultations/<id>/messages/` - Chat messages
- `POST /consultations/<id>/end/` - End consultation

### 4. Video Platform (`/videos/`)
- `GET /videos/` - List approved videos
- `POST /videos/upload/` - Upload video (teachers only)
- `GET /videos/<id>/` - Get video details
- `POST /videos/<id>/approve/` - Approve video (admin)

### 5. Notes Platform (`/notes/`)
- `GET /notes/` - List approved notes
- `POST /notes/upload/` - Upload note
- `GET /notes/<id>/` - Get note details
- `POST /notes/<id>/purchase/` - Purchase paid note
- `GET /notes/my-notes/` - Get uploaded notes
- `GET /notes/my-purchases/` - Get purchased notes
- `POST /notes/<id>/approve/` - Approve note (admin)

### 6. Student Forum (`/forums/`)
- `GET /forums/messages/` - Get forum messages
- `POST /forums/messages/` - Post message
- `DELETE /forums/messages/<id>/delete/` - Delete own message

### 7. Field Information (`/fields/`)
- `GET /fields/` - List all fields
- `GET /fields/<id>/` - Get field details
- `GET /fields/name/<name>/` - Get field by name
- `POST /fields/create/` - Create field (admin)
- `PUT /fields/<id>/update/` - Update field (admin)

## Database Models

### Accounts
- User (with user_type: student/teacher/consultant/admin)
- StudentProfile
- TeacherProfile
- ConsultantProfile

### Exams
- Exam
- Question (4 options: A, B, C, D)
- ExamAttempt
- Answer

### Consultations
- Consultation
- WeeklySchedule
- ChatMessage

### Videos
- Video (with approval field)

### Notes
- Note (with approval and pricing)
- NotePurchase

### Forums
- ForumMessage

### Fields
- Field (Computer Engineering, Computer Science, Electrical Engineering, IT)

## Next Steps

1. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

2. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

3. **Start server**:
   ```bash
   python manage.py runserver
   ```

## Authentication

All protected endpoints require:
- Header: `Authorization: Token <your_token>`
- Token obtained from `/accounts/login/` or `/accounts/register/`

