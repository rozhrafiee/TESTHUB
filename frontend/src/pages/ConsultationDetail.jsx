import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { consultationsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./ConsultationDetail.css";

const ConsultationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newSchedule, setNewSchedule] = useState({
    day: "monday",
    time: "",
    activity: "",
    week_start_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const { isConsultant, isStudent } = useAuth();

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (consultation) {
      console.log("وضعیت مشاوره:", consultation.active ? "فعال" : "غیرفعال");
      console.log("جزئیات مشاوره:", consultation);
      setCanSendMessage(consultation.active);
    }
  }, [consultation]);

  const loadData = async () => {
    await Promise.all([loadConsultation(), loadSchedules(), loadMessages()]);
    setLoading(false);
  };

  const loadConsultation = async () => {
    try {
      const response = await consultationsAPI.getMyConsultations();
      const found = response.data.find((c) => c.id === parseInt(id));
      console.log("Consultation active status:", found?.active);
      setConsultation(found);

      if (found && !found.active) {
        console.log("مشاوره غیرفعال است، نمی‌توان پیام ارسال کرد");
      }
    } catch (error) {
      console.error("Error loading consultation:", error);
    }
  };

  const loadSchedules = async () => {
    try {
      const response = await consultationsAPI.getSchedules(id);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await consultationsAPI.getMessages(id);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !consultation?.active) return;

    try {
      await consultationsAPI.sendMessage(id, newMessage);
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.error || "خطا در ارسال پیام");
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await consultationsAPI.createSchedule(id, newSchedule);
      setNewSchedule({
        day: "monday",
        time: "",
        activity: "",
        week_start_date: "",
      });
      loadSchedules();
    } catch (error) {
      alert(error.response?.data?.error || "خطا در ایجاد برنامه");
    }
  };

  const handleActivateConsultation = async () => {
    if (
      !window.confirm("آیا مطمئن هستید که می‌خواهید این مشاوره را فعال کنید؟")
    )
      return;

    try {
      // روش اول: اگر API فعال‌سازی داری
      await consultationsAPI.activateConsultation(id);

      // روش دوم: اگر API فعال‌سازی نداری، از آپدیت استفاده کن
      // await consultationsAPI.updateConsultation(id, { active: true })

      alert("مشاوره با موفقیت فعال شد");
      loadConsultation(); // دوباره بارگذاری کن تا وضعیت آپدیت بشه
    } catch (error) {
      console.error("Activation error:", error);

      // اگر API فعال‌سازی وجود نداره، این خط رو امتحان کن:
      try {
        await consultationsAPI.updateConsultation(id, { active: true });
        alert("مشاوره فعال شد");
        loadConsultation();
      } catch (updateError) {
        alert("خطا در فعال‌سازی مشاوره. لطفاً با پشتیبانی تماس بگیرید.");
      }
    }
  };

  const handleEndConsultation = async () => {
    if (
      !window.confirm("آیا مطمئن هستید که می‌خواهید این مشاوره را پایان دهید؟")
    )
      return;

    try {
      await consultationsAPI.endConsultation(id);
      navigate("/consultations");
    } catch (error) {
      alert(error.response?.data?.error || "خطا در پایان مشاوره");
    }
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  if (!consultation) {
    return <div className="error">مشاوره یافت نشد</div>;
  }

  return (
    <div className="consultation-detail">
      <div className="consultation-header">
        <h1>
          مشاوره با{" "}
          {isStudent
            ? consultation.consultant.username
            : consultation.student.username}
        </h1>

        {/* نمایش وضعیت مشاوره */}
        <div className="consultation-status">
          <span
            className={`status-badge ${
              consultation.active ? "active" : "inactive"
            }`}
          >
            وضعیت: {consultation.active ? "فعال" : "غیرفعال"}
          </span>
        </div>

        {/* دکمه‌های مختلف بر اساس وضعیت */}
        <div className="consultation-actions">
          {isConsultant && !consultation.active && (
            <button
              onClick={handleActivateConsultation}
              className="btn btn-success"
            >
              فعال‌سازی مشاوره
            </button>
          )}

          {isStudent && consultation.active && (
            <button onClick={handleEndConsultation} className="btn btn-danger">
              پایان مشاوره
            </button>
          )}
        </div>
      </div>

      <div className="consultation-content">
        <div className="schedules-section">
          <h2>برنامه هفتگی</h2>
          {isConsultant && (
            <form onSubmit={handleCreateSchedule} className="schedule-form">
              <div className="form-row">
                <div className="form-group">
                  <label>روز هفته</label>
                  <select
                    value={newSchedule.day}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, day: e.target.value })
                    }
                    required
                  >
                    <option value="monday">دوشنبه</option>
                    <option value="tuesday">سه‌شنبه</option>
                    <option value="wednesday">چهارشنبه</option>
                    <option value="thursday">پنج‌شنبه</option>
                    <option value="friday">جمعه</option>
                    <option value="saturday">شنبه</option>
                    <option value="sunday">یکشنبه</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>زمان</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>تاریخ شروع هفته</label>
                  <input
                    type="date"
                    value={newSchedule.week_start_date}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        week_start_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>فعالیت</label>
                <textarea
                  value={newSchedule.activity}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, activity: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                افزودن برنامه
              </button>
            </form>
          )}
          <div className="schedules-list">
            {schedules.length === 0 ? (
              <p>برنامه‌ای وجود ندارد</p>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-day">{schedule.day}</div>
                  <div className="schedule-time">{schedule.time}</div>
                  <div className="schedule-activity">{schedule.activity}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="messages-section">
          <h2>چت</h2>
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender.id ===
                  (isStudent
                    ? consultation.student.id
                    : consultation.consultant.id)
                    ? "own"
                    : ""
                }`}
              >
                <div className="message-header">
                  <strong>{message.sender.username}</strong>
                  <span className="message-time">
                    {new Date(message.created_at).toLocaleString("fa-IR")}
                  </span>
                </div>
                <div className="message-text">{message.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                consultation.active
                  ? "پیام خود را بنویسید..."
                  : "مشاوره فعال نیست"
              }
              disabled={!consultation.active}
              className="message-input"
            />
            <button
              type="submit"
              disabled={!consultation.active}
              className={`btn ${
                consultation.active ? "btn-primary" : "btn-disabled"
              }`}
            >
              {consultation.active ? "ارسال" : "غیرفعال"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;
