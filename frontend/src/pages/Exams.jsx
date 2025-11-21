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
  const { isAuthenticated, isStudent, isTeacher } = useAuth(); // تغییر به isTeacher

  // حالت‌های مربوط به ساخت آزمون
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    field: "computer",
    duration_minutes: 120,
    required_level: "beginner",
  });

  const [questions, setQuestions] = useState([
    {
      text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
    },
  ]);

  useEffect(() => {
    loadExams();
    if (isAuthenticated && isStudent) {
      loadLevel();
    }
  }, [isAuthenticated, isStudent]);

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
    if (!newExam.title.trim()) {
      alert("عنوان آزمون الزامی است");
      return;
    }

    // بررسی پر بودن همه سوالات
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`متن سوال ${i + 1} باید پر شود`);
        return;
      }
      if (
        !q.option_a.trim() ||
        !q.option_b.trim() ||
        !q.option_c.trim() ||
        !q.option_d.trim()
      ) {
        alert(`همه گزینه‌های سوال ${i + 1} باید پر شوند`);
        return;
      }
    }

    try {
      // ۱. ایجاد آزمون
      const examResponse = await examsAPI.createExam(newExam);
      const examId = examResponse.data.id;

      // ۲. ایجاد سوالات
      for (const question of questions) {
        await examsAPI.createQuestion(examId, question);
      }

      alert("آزمون با موفقیت ایجاد شد!");
      setShowCreateForm(false);
      setNewExam({
        title: "",
        description: "",
        field: "computer",
        duration_minutes: 120,
        required_level: "beginner",
      });
      setQuestions([
        {
          text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "A",
        },
      ]);

      // رفرش لیست
      loadExams();
    } catch (error) {
      console.error("Error creating exam:", error);
      alert(
        "خطا در ایجاد آزمون: " +
          (error.response?.data?.error || "خطای ناشناخته")
      );
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <div className="exams-page">
      <div className="exams-header">
        <h1>آزمون‌های آزمایشی</h1>

        {isTeacher && ( // تغییر به isTeacher
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-success"
          >
            {showCreateForm ? "انصراف" : "طراحی آزمون جدید"}
          </button>
        )}
      </div>

      {isAuthenticated && isStudent && level !== null && (
        <div className="level-badge">سطح شما: {level}</div>
      )}

      {/* فرم ساخت آزمون برای اساتید */}
      {showCreateForm &&
        isTeacher && ( // تغییر به isTeacher
          <div className="create-exam-form">
            <h2>طراحی آزمون جدید</h2>

            <div className="form-group">
              <label>عنوان آزمون *</label>
              <input
                type="text"
                value={newExam.title}
                onChange={(e) =>
                  setNewExam({ ...newExam, title: e.target.value })
                }
                placeholder="مثال: آزمون جامع مهندسی کامپیوتر"
              />
            </div>

            <div className="form-group">
              <label>توضیحات</label>
              <textarea
                value={newExam.description}
                onChange={(e) =>
                  setNewExam({ ...newExam, description: e.target.value })
                }
                placeholder="توضیحات درباره آزمون..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>رشته</label>
                <select
                  value={newExam.field}
                  onChange={(e) =>
                    setNewExam({ ...newExam, field: e.target.value })
                  }
                >
                  <option value="computer">مهندسی کامپیوتر</option>
                  <option value="electric">مهندسی برق</option>
                  <option value="civil">مهندسی عمران</option>
                  <option value="math">ریاضی</option>
                  <option value="physics">فیزیک</option>
                  <option value="chemistry">شیمی</option>
                  <option value="general">عمومی</option>
                </select>
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
                <select
                  value={newExam.required_level}
                  onChange={(e) =>
                    setNewExam({ ...newExam, required_level: e.target.value })
                  }
                >
                  <option value="beginner">مبتدی</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">پیشرفته</option>
                </select>
              </div>
            </div>

            <h3>سوالات آزمون ({questions.length} سوال)</h3>

            {questions.map((question, index) => (
              <div key={index} className="question-card">
                <div className="question-header">
                  <h4>سوال {index + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(index)}
                      className="btn btn-danger btn-sm"
                      type="button"
                    >
                      حذف سوال
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
                    placeholder="متن سوال را اینجا بنویسید..."
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
                        placeholder={`متن گزینه ${option}`}
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
                + افزودن سوال جدید
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

      {/* لیست آزمون‌ها */}
      <div className="exams-grid">
        {exams.length === 0 ? (
          <div className="no-exams">
            <p>هیچ آزمونی یافت نشد</p>
            {isTeacher &&
              !showCreateForm && ( // تغییر به isTeacher
                <p>می‌توانید اولین آزمون را ایجاد کنید!</p>
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
                {isTeacher && ( // تغییر به isTeacher - نمایش سازنده آزمون
                  <span>سازنده: {exam.creator?.username || "سیستم"}</span>
                )}
              </div>
              <Link to={`/exams/${exam.id}`} className="btn btn-primary">
                {isStudent ? "شرکت در آزمون" : "مشاهده آزمون"}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Exams;
