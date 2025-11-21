import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fieldsAPI } from "../services/api";
import "./Fields.css";

const Fields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const staticFields = [
    {
      id: 1,
      title: "مهندسی کامپیوتر",
      description: "طراحی و توسعه نرم‌افزار و سخت‌افزار",
      icon: "💻",
      details:
        "این رشته شامل گرایش‌های نرم‌افزار، سخت‌افزار، هوش مصنوعی و شبکه می‌شود. بازار کار عالی دارد.",
    },
    {
      id: 2,
      title: "مهندسی برق",
      description: "الکتریسیته، الکترومغناطیس و الکترونیک",
      icon: "⚡",
      details:
        "مهندسی برق نقش حیاتی در صنعت و تکنولوژی مدرن دارد. فرصت‌های شغلی متنوعی دارد.",
    },
    {
      id: 3,
      title: "مهندسی عمران",
      description: "ساخت سازه‌ها و زیرساخت‌ها",
      icon: "🏗️",
      details:
        "طراحی، ساخت و نگهداری سازه‌ها مانند پل‌ها، ساختمان‌ها، جاده‌ها و سدها.",
    },
    {
      id: 4,
      title: "پزشکی",
      description: "تشخیص و درمان بیماری‌ها",
      icon: "⚕️",
      details:
        "رشته پزشکی نیازمند تحصیلات طولانی‌مدت و تعهد بالاست. اهمیت اجتماعی بالایی دارد.",
    },
    {
      id: 5,
      title: "حقوق",
      description: "مطالعه قوانین و مقررات",
      icon: "⚖️",
      details:
        "آشنایی با سیستم قضایی و قانونگذاری. فرصت‌های شغلی در دستگاه قضایی و وکالت.",
    },
    {
      id: 6,
      title: "مدیریت",
      description: "اصول مدیریت و بازاریابی",
      icon: "📊",
      details: "آموزش اصول مدیریت، بازاریابی، منابع انسانی و مدیریت استراتژیک.",
    },
    {
      id: 7,
      title: "روانشناسی",
      description: "مطالعه رفتار و ذهن",
      icon: "🧠",
      details: "شامل شاخه‌های مختلفی مانند بالینی، صنعتی و تربیتی است.",
    },
    {
      id: 8,
      title: "مهندسی صنایع",
      description: "بهینه‌سازی سیستم‌ها",
      icon: "🏭",
      details:
        "هدف افزایش بهره‌وری و کاهش هزینه‌ها در سیستم‌های تولیدی و خدماتی.",
    },
    {
      id: 9,
      title: "مهندسی مکانیک",
      description: "طراحی سیستم‌های مکانیکی",
      icon: "🔧",
      details:
        "پایه بسیاری از صنایع است. فرصت‌های شغلی در صنایع خودروسازی و نفت.",
    },
    {
      id: 10,
      title: "علوم کامپیوتر",
      description: "الگوریتم‌ها و محاسبات",
      icon: "🔬",
      details:
        "مطالعه تئوری‌های پایه کامپیوتر، الگوریتم‌ها، ساختار داده‌ها و محاسبات.",
    },
  ];

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const response = await fieldsAPI.list();
      setFields(response.data.length > 0 ? response.data : staticFields);
    } catch (error) {
      setFields(staticFields);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedField(null);
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <div className="fields-page">
      <div className="fields-header">
        <h1>رشته‌های دانشگاهی</h1>
        <p>برای مشاهده اطلاعات هر رشته روی آن کلیک کنید</p>
      </div>

      <div className="fields-grid">
        {fields.map((field) => (
          <div
            key={field.id}
            className="field-card"
            onClick={() => handleFieldClick(field)}
          >
            <div className="field-icon">{field.icon || "🎓"}</div>
            <h3>{field.title}</h3>
            <p>{field.description}</p>
            <button className="field-btn">مشاهده اطلاعات</button>
          </div>
        ))}
      </div>

      {/* Modal برای نمایش اطلاعات */}
      {showModal && selectedField && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedField.title}</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">{selectedField.icon}</div>
              <p>
                <strong>توضیحات:</strong> {selectedField.details}
              </p>
              <div className="modal-info">
                <div className="info-item">
                  <strong>بازار کار:</strong> عالی
                </div>
                <div className="info-item">
                  <strong>مدت تحصیل:</strong> ۴ سال
                </div>
                <div className="info-item">
                  <strong>گرایش‌ها:</strong> ۳-۴ گرایش
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={closeModal}>
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;
