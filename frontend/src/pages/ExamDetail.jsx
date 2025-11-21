import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExam();
  }, [id]);

  const loadExam = () => {
    try {
      // همه آزمون‌ها رو از localStorage بگیر
      const allExams = JSON.parse(localStorage.getItem("mockExams") || "[]");
      const foundExam = allExams.find((exam) => exam.id === parseInt(id));

      if (foundExam) {
        setExam(foundExam);
      } else {
        alert("آزمون یافت نشد");
        navigate("/exams");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در بارگذاری آزمون");
      navigate("/exams");
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    if (exam && exam.questions && exam.questions.length > 0) {
      navigate(`/exam-taking/${exam.id}`);
    } else {
      alert("این آزمون سوالی ندارد");
    }
  };

  if (loading) return <div className="loading">در حال بارگذاری...</div>;
  if (!exam) return <div className="error">آزمون یافت نشد</div>;

  return (
    <div className="exam-detail">
      <div className="exam-header">
        <h1>{exam.title}</h1>
        <button
          onClick={() => navigate("/exams")}
          className="btn btn-secondary"
        >
          بازگشت
        </button>
      </div>

      <div className="exam-info">
        <p>
          <strong>توضیحات:</strong> {exam.description}
        </p>
        <p>
          <strong>رشته:</strong> {exam.field}
        </p>
        <p>
          <strong>مدت زمان:</strong> {exam.duration_minutes} دقیقه
        </p>
        <p>
          <strong>سطح مورد نیاز:</strong> {exam.required_level}
        </p>
        <p>
          <strong>تعداد سوالات:</strong> {exam.question_count} سوال
        </p>
        <p>
          <strong>سازنده:</strong> {exam.creator?.username || "شما"}
        </p>
      </div>

      <div className="exam-actions">
        <button onClick={startExam} className="btn btn-primary">
          شروع آزمون
        </button>
      </div>

      {/* نمایش سوالات */}
      <div className="questions-preview">
        <h3>سوالات آزمون</h3>
        {exam.questions &&
          exam.questions.map((question, index) => (
            <div key={index} className="question-preview">
              <h4>سوال {index + 1}</h4>
              <p>{question.text}</p>
              <div className="options-preview">
                <p>
                  <strong>الف)</strong> {question.option_a}
                </p>
                <p>
                  <strong>ب)</strong> {question.option_b}
                </p>
                <p>
                  <strong>ج)</strong> {question.option_c}
                </p>
                <p>
                  <strong>د)</strong> {question.option_d}
                </p>
              </div>
              <p>
                <strong>پاسخ صحیح:</strong> گزینه {question.correct_answer}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExamDetail;
