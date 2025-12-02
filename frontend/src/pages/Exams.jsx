import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { examsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./Exams.css";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();

  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    field: "Computer Science",
    duration_minutes: 60,
    required_level: 1,
    questions: [
      {
        text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        points: 1,
        order: 1,
      },
    ],
  });

  useEffect(() => {
    loadExams();
    if (user?.user_type === "student") {
      loadLevel();
    }
  }, [user]);

  const loadExams = async () => {
    try {
      const response = await examsAPI.list();
      setExams(response.data);
    } catch (error) {
      console.error("Error loading exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLevel = async () => {
    try {
      const response = await examsAPI.getMyLevel();
      setLevel(response.data.level);
    } catch (error) {
      console.error("Error loading level:", error);
    }
  };

  const handleCreateExam = async () => {
    try {
      const response = await examsAPI.createExam(newExam);
      setExams([response.data, ...exams]);
      setShowCreateForm(false);
      setNewExam({
        title: "",
        description: "",
        field: "Computer Science",
        duration_minutes: 60,
        required_level: 1,
        questions: [
          {
            text: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            correct_answer: "A",
            points: 1,
            order: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  const addQuestion = () => {
    setNewExam({
      ...newExam,
      questions: [
        ...newExam.questions,
        {
          text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "A",
          points: 1,
          order: newExam.questions.length + 1,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (newExam.questions.length > 1) {
      const newQuestions = newExam.questions.filter((_, i) => i !== index);
      setNewExam({ ...newExam, questions: newQuestions });
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...newExam.questions];
    newQuestions[index][field] = value;
    setNewExam({ ...newExam, questions: newQuestions });
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <div className="exams-page">
      <div className="exams-header">
        <h1>آزمون‌ها</h1>

        {user?.user_type === "teacher" && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-success"
          >
            {showCreateForm ? "انصراف" : "ایجاد آزمون جدید"}
          </button>
        )}
      </div>

      {user?.user_type === "student" && level !== null && (
        <div className="level-badge">سطح شما: {level}</div>
      )}

      {showCreateForm && user?.user_type === "teacher" && (
        <div className="create-exam-form">
          <h2>ایجاد آزمون جدید</h2>

          <div className="form-group">
            <label>عنوان *</label>
            <input
              type="text"
              value={newExam.title}
              onChange={(e) =>
                setNewExam({ ...newExam, title: e.target.value })
              }
              placeholder="مثال: مبانی علوم کامپیوتر"
            />
          </div>

          <div className="form-group">
            <label>توضیحات</label>
            <textarea
              value={newExam.description}
              onChange={(e) =>
                setNewExam({ ...newExam, description: e.target.value })
              }
              placeholder="توضیح مختصری درباره آزمون..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>رشته</label>
              <input
                type="text"
                value={newExam.field}
                onChange={(e) =>
                  setNewExam({ ...newExam, field: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>مدت زمان (دقیقه)</label>
              <input
                type="number"
                value={newExam.duration_minutes}
                onChange={(e) =>
                  setNewExam({
                    ...newExam,
                    duration_minutes: parseInt(e.target.value),
                  })
                }
                min="1"
              />
            </div>

            <div className="form-group">
              <label>سطح مورد نیاز</label>
              <input
                type="number"
                value={newExam.required_level}
                onChange={(e) =>
                  setNewExam({
                    ...newExam,
                    required_level: parseInt(e.target.value),
                  })
                }
                min="1"
              />
            </div>
          </div>

          <h3>سوالات ({newExam.questions.length})</h3>

          {newExam.questions.map((question, index) => (
            <div key={index} className="question-card">
              <div className="question-header">
                <h4>سوال {index + 1}</h4>
                {newExam.questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(index)}
                    className="btn btn-danger btn-sm"
                    type="button"
                  >
                    حذف
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>متن سوال *</label>
                <textarea
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(index, "text", e.target.value)
                  }
                  placeholder="متن سوال را وارد کنید..."
                  rows="3"
                />
              </div>

              <div className="options-grid">
                {["A", "B", "C", "D"].map((option) => (
                  <div key={option} className="option-group">
                    <label>گزینه {option} *</label>
                    <input
                      type="text"
                      value={question[`option_${option.toLowerCase()}`]}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          `option_${option.toLowerCase()}`,
                          e.target.value
                        )
                      }
                      placeholder={`گزینه ${option}`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>پاسخ صحیح</label>
                <select
                  value={question.correct_answer}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "correct_answer",
                      e.target.value
                    )
                  }
                >
                  <option value="A">گزینه A</option>
                  <option value="B">گزینه B</option>
                  <option value="C">گزینه C</option>
                  <option value="D">گزینه D</option>
                </select>
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button
              onClick={addQuestion}
              className="btn btn-secondary"
              type="button"
            >
              + افزودن سوال
            </button>

            <button
              onClick={handleCreateExam}
              className="btn btn-primary"
              disabled={!newExam.title.trim()}
              type="button"
            >
              ایجاد آزمون
            </button>
          </div>
        </div>
      )}

      <div className="exams-grid">
        {exams.length === 0 ? (
          <div className="no-exams">
            <p>هیچ آزمونی یافت نشد.</p>
            {user?.user_type === "teacher" && !showCreateForm && (
              <p>شما می‌توانید اولین آزمون را ایجاد کنید!</p>
            )}
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
              <div className="exam-info">
                <span>رشته: {exam.field}</span>
                <span>مدت زمان: {exam.duration_minutes} دقیقه</span>
                <span>سوالات: {exam.question_count}</span>
                {exam.required_level && (
                  <span>سطح مورد نیاز: {exam.required_level}</span>
                )}
              </div>
              <Link to={`/exams/${exam.id}`} className="btn btn-primary">
                {user?.user_type === "student" ? "شرکت در آزمون" : "مشاهده آزمون"}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Exams;
