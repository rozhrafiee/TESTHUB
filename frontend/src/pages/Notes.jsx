import { useState, useEffect } from "react";
import { notesAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [purchasedNotes, setPurchasedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'my_uploads', 'purchased'
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    field: "",
    file: null,
    is_paid: false,
    price: "",
  });
  const { isAuthenticated, isTeacher, isStudent, user } = useAuth();

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      filterNotes();
    }
  }, [notes, activeTab]);

  // به کامپوننت Notes.js اضافه کن - بالای return
  const [testNotes] = useState([
    {
      id: 1,
      title: "جزوه تست",
      description: "این یک جزوه تست است",
      field: "کامپیوتر",
      is_paid: false,
      price: "0",
      uploader: "استاد تست",
    },
  ]);

  // و این خط رو عوض کن:
  const displayNotes = notes.length > 0 ? notes : testNotes;

  const loadNotes = async () => {
    try {
      const response = await notesAPI.list(); // همینه درستش
      setNotes(response.data);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    if (isTeacher) {
      // برای استاد: جزواتی که خودش آپلود کرده
      const myUploads = notes.filter(
        (note) =>
          note.uploader?.id === user?.id || note.uploader === user?.username
      );
      setMyUploads(myUploads);
    }

    if (isStudent) {
      // برای دانشجو: جزواتی که خریداری کرده
      const purchased = notes.filter((note) => note.is_purchased);
      setPurchasedNotes(purchased);
    }
  };

  const handlePurchase = async (noteId) => {
    try {
      await notesAPI.purchase(noteId);
      alert("خرید با موفقیت انجام شد!");
      loadNotes(); // رفرش لیست
    } catch (error) {
      alert(error.response?.data?.error || "خطا در خرید");
    }
  };

  const handleUploadChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "file") {
      setUploadForm((prev) => ({ ...prev, file: files[0] }));
    } else if (name === "is_paid") {
      setUploadForm((prev) => ({ ...prev, is_paid: checked }));
    } else {
      setUploadForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      setUploadError("عنوان جزوه الزامی است");
      return;
    }
    if (!uploadForm.file) {
      setUploadError("لطفا فایل جزوه را انتخاب کنید");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);
      formData.append("field", uploadForm.field);
      formData.append("file", uploadForm.file);
      formData.append("is_paid", uploadForm.is_paid.toString());

      if (uploadForm.is_paid && uploadForm.price) {
        formData.append("price", uploadForm.price);
      }

      await notesAPI.upload(formData);
      setUploadMessage("جزوه با موفقیت آپلود شد!");
      setUploadForm({
        title: "",
        description: "",
        field: "",
        file: null,
        is_paid: false,
        price: "",
      });

      // رفرش لیست جزوات
      loadNotes();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.response?.data?.error || "خطا در آپلود جزوه");
    } finally {
      setUploading(false);
    }
  };

  const getCurrentNotes = () => {
    switch (activeTab) {
      case "my_uploads":
        return myUploads;
      case "purchased":
        return purchasedNotes;
      default:
        return notes;
    }
  };

  const downloadNote = (note) => {
    // ساخت لینک دانلود
    const fileUrl = note.file.startsWith("http")
      ? note.file
      : `http://localhost:8000${note.file}`;
    window.open(fileUrl, "_blank");
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <div className="notes-page">
      <h1>📚 مدیریت جزوات</h1>

      {/* تب‌های مختلف */}
      <div className="notes-tabs">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          همه جزوات ({notes.length})
        </button>

        {isTeacher && (
          <button
            className={`tab-button ${
              activeTab === "my_uploads" ? "active" : ""
            }`}
            onClick={() => setActiveTab("my_uploads")}
          >
            جزوات من ({myUploads.length})
          </button>
        )}

        {isStudent && (
          <button
            className={`tab-button ${
              activeTab === "purchased" ? "active" : ""
            }`}
            onClick={() => setActiveTab("purchased")}
          >
            جزوات خریداری شده ({purchasedNotes.length})
          </button>
        )}
      </div>

      {/* فرم آپلود فقط برای اساتید */}
      {isTeacher && (
        <div className="upload-section">
          <div className="card upload-card">
            <h2>📤 آپلود جزوه جدید</h2>
            <form onSubmit={handleUploadSubmit} className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label>عنوان جزوه *</label>
                  <input
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleUploadChange}
                    placeholder="عنوان جزوه"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>رشته</label>
                  <select
                    name="field"
                    value={uploadForm.field}
                    onChange={handleUploadChange}
                  >
                    <option value="">انتخاب رشته</option>
                    <option value="computer">مهندسی کامپیوتر</option>
                    <option value="electric">مهندسی برق</option>
                    <option value="civil">مهندسی عمران</option>
                    <option value="math">ریاضی</option>
                    <option value="physics">فیزیک</option>
                    <option value="general">عمومی</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>توضیحات</label>
                <textarea
                  name="description"
                  value={uploadForm.description}
                  onChange={handleUploadChange}
                  placeholder="توضیحات درباره جزوه..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>فایل PDF *</label>
                <input
                  type="file"
                  name="file"
                  accept=".pdf,application/pdf"
                  onChange={handleUploadChange}
                  required
                />
                {uploadForm.file && (
                  <span className="file-name">
                    فایل انتخاب شده: {uploadForm.file.name}
                  </span>
                )}
              </div>

              <div className="paid-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_paid"
                    checked={uploadForm.is_paid}
                    onChange={handleUploadChange}
                  />
                  <span>جزوه پولی</span>
                </label>

                {uploadForm.is_paid && (
                  <div className="form-group price-input">
                    <label>قیمت (تومان) *</label>
                    <input
                      type="number"
                      name="price"
                      value={uploadForm.price}
                      onChange={handleUploadChange}
                      placeholder="مثال: 50000"
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="message error">{uploadError}</div>
              )}

              {uploadMessage && (
                <div className="message success">{uploadMessage}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary upload-btn"
                disabled={uploading}
              >
                {uploading ? "⏳ در حال آپلود..." : "📤 آپلود جزوه"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* نمایش جزوات */}
      <div className="notes-section">
        <h2>
          {activeTab === "all" && "📖 همه جزوات"}
          {activeTab === "my_uploads" && "📚 جزوات من"}
          {activeTab === "purchased" && "🛒 جزوات خریداری شده"}
        </h2>

        <div className="notes-grid">
          {getCurrentNotes().length === 0 ? (
            <div className="no-notes">
              <p>📭 هیچ جزوه‌ای یافت نشد</p>
              {isTeacher && activeTab === "my_uploads" && (
                <p>هنوز هیچ جزوه‌ای آپلود نکرده‌اید!</p>
              )}
              {isStudent && activeTab === "purchased" && (
                <p>هنوز هیچ جزوه‌ای خریداری نکرده‌اید!</p>
              )}
            </div>
          ) : (
            getCurrentNotes().map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <span
                    className={`note-type ${note.is_paid ? "paid" : "free"}`}
                  >
                    {note.is_paid ? "💎 پولی" : "🆓 رایگان"}
                  </span>
                </div>

                <p className="note-description">{note.description}</p>

                <div className="note-info">
                  <div className="info-row">
                    <span>
                      👤 آپلود کننده: {note.uploader_name || note.uploader}
                    </span>
                  </div>
                  {note.field && (
                    <div className="info-row">
                      <span>🎯 رشته: {note.field}</span>
                    </div>
                  )}
                  {note.is_paid && (
                    <div className="info-row">
                      <span className="price">💰 قیمت: {note.price} تومان</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span>
                      📅 تاریخ:{" "}
                      {new Date(note.created_at).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>

                <div className="note-actions">
                  {/* برای دانشجو */}
                  {isStudent && (
                    <>
                      {note.is_paid ? (
                        note.is_purchased ? (
                          <button
                            onClick={() => downloadNote(note)}
                            className="btn btn-success"
                          >
                            📥 دانلود
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchase(note.id)}
                            className="btn btn-primary"
                            disabled={!isAuthenticated}
                          >
                            {isAuthenticated
                              ? "🛒 خرید"
                              : "⚠️ برای خرید وارد شوید"}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => downloadNote(note)}
                          className="btn btn-primary"
                        >
                          📥 دانلود رایگان
                        </button>
                      )}
                    </>
                  )}

                  {/* برای استاد */}
                  {isTeacher && (
                    <>
                      <button
                        onClick={() => downloadNote(note)}
                        className="btn btn-primary"
                      >
                        📥 دانلود
                      </button>

                      {/* دکمه مدیریت برای استاد (اگر جزوه خودش هست) */}
                      {(note.uploader?.id === user?.id ||
                        note.uploader === user?.username) && (
                        <button className="btn btn-outline">✏️ مدیریت</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
