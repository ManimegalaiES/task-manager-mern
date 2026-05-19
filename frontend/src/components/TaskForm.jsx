import { useState } from "react";
import { createTask } from "../api/taskApi";

const TaskForm = ({ refreshTasks }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }
    try {
      setLoading(true);
      await createTask(formData);
      setFormData({ title: "", description: "", priority: "Medium", dueDate: "" });
      refreshTasks();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.log(error);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const PRIORITY_OPTS = [
    { value: "Low",    color: "#34d399", icon: "↓" },
    { value: "Medium", color: "#fb923c", icon: "→" },
    { value: "High",   color: "#f87171", icon: "↑" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .tf-wrap {
          font-family: 'DM Sans', sans-serif;
          background: rgba(15,20,35,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 32px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }
        .tf-wrap::before {
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:3px;
          background: linear-gradient(90deg,#4f46e5,#c084fc,#f472b6);
          background-size:200% 100%;
          animation: tfShimmer 3s linear infinite;
        }
        @keyframes tfShimmer {
          0%{background-position:200% 0} 100%{background-position:-200% 0}
        }

        .tf-heading {
          display:flex; align-items:center; gap:12px; margin-bottom:28px;
        }
        .tf-heading-icon {
          width:40px; height:40px; border-radius:11px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          display:flex;align-items:center;justify-content:center;
          font-size:18px;
          box-shadow:0 6px 18px rgba(99,102,241,0.4);
          flex-shrink:0;
        }
        .tf-heading h2 {
          font-family:'Playfair Display',serif;
          font-size:22px; font-weight:700; color:#f1f5f9;
        }
        .tf-heading p {
          font-size:12px; color:#475569; font-weight:300; margin-top:1px;
        }

        .tf-field { margin-bottom:20px; }
        .tf-label {
          display:block; margin-bottom:7px;
          font-size:11px; font-weight:500; color:#64748b;
          text-transform:uppercase; letter-spacing:0.09em;
        }

        .tf-input, .tf-textarea, .tf-select {
          width:100%;
          font-family:'DM Sans',sans-serif;
          font-size:14px; font-weight:400; color:#e2e8f0;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:12px;
          padding:12px 16px;
          outline:none;
          transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
          resize:none;
        }
        .tf-input::placeholder, .tf-textarea::placeholder { color:#334155; }
        .tf-input:focus, .tf-textarea:focus, .tf-select:focus {
          border-color:rgba(129,140,248,0.5);
          background:rgba(129,140,248,0.06);
          box-shadow:0 0 0 3px rgba(99,102,241,0.12);
        }
        .tf-select { appearance:none; -webkit-appearance:none; cursor:pointer; }
        .tf-select option { background:#0f1627; color:#e2e8f0; }

        /* Priority toggle buttons */
        .tf-priority-group {
          display:flex; gap:8px;
        }
        .tf-priority-btn {
          flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
          padding:10px 8px;
          border-radius:11px;
          font-family:'DM Sans',sans-serif;
          font-size:13px; font-weight:500;
          cursor:pointer;
          border:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.03);
          color:#64748b;
          transition:all 0.18s;
        }
        .tf-priority-btn:hover { background:rgba(255,255,255,0.06); color:#94a3b8; }
        .tf-priority-btn.active {
          color:var(--p-color);
          border-color:var(--p-color);
          background:rgba(var(--p-rgb),0.1);
          box-shadow:0 0 14px rgba(var(--p-rgb),0.15);
        }
        .tf-priority-dot {
          width:7px; height:7px; border-radius:50%;
          background:currentColor;
        }

        /* Date input */
        .tf-date-wrap { position:relative; }
        .tf-date-wrap svg {
          position:absolute; right:14px; top:50%; transform:translateY(-50%);
          color:#334155; pointer-events:none;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity:0; }

        /* Submit */
        .tf-submit {
          width:100%; padding:13px;
          border-radius:12px;
          border:none;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:#fff;
          font-family:'DM Sans',sans-serif;
          font-size:15px; font-weight:500;
          cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:9px;
          transition:transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          box-shadow:0 8px 24px rgba(99,102,241,0.35);
          margin-top:8px;
        }
        .tf-submit:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 14px 32px rgba(99,102,241,0.45);
        }
        .tf-submit:active:not(:disabled) { transform:translateY(0); }
        .tf-submit:disabled { opacity:0.6; cursor:not-allowed; }
        .tf-submit.success {
          background:linear-gradient(135deg,#059669,#10b981);
          box-shadow:0 8px 24px rgba(16,185,129,0.35);
        }

        /* Spinner */
        .tf-spinner {
          width:16px; height:16px;
          border:2px solid rgba(255,255,255,0.3);
          border-top-color:#fff;
          border-radius:50%;
          animation:spin 0.7s linear infinite;
        }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="tf-wrap">
        <div className="tf-heading">
          <div className="tf-heading-icon">＋</div>
          <div>
            <h2>New Task</h2>
            <p>Add a task to your board</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="tf-field">
            <label className="tf-label">Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="tf-input"
            />
          </div>

          {/* Description */}
          <div className="tf-field">
            <label className="tf-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add more context (optional)…"
              className="tf-textarea"
            />
          </div>

          {/* Priority */}
          <div className="tf-field">
            <label className="tf-label">Priority</label>
            <div className="tf-priority-group">
              {PRIORITY_OPTS.map(({ value, color, icon }) => {
                const rgb = value === "Low" ? "52,211,153" : value === "Medium" ? "251,146,60" : "248,113,113";
                return (
                  <button
                    key={value}
                    type="button"
                    className={`tf-priority-btn${formData.priority === value ? " active" : ""}`}
                    style={{ "--p-color": color, "--p-rgb": rgb }}
                    onClick={() => setFormData({ ...formData, priority: value })}
                  >
                    <span className="tf-priority-dot" />
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div className="tf-field">
            <label className="tf-label">Due Date</label>
            <div className="tf-date-wrap">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="tf-input"
                style={{ paddingRight: "40px" }}
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`tf-submit${success ? " success" : ""}`}
          >
            {loading ? (
              <><div className="tf-spinner" /> Creating…</>
            ) : success ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Task Created!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default TaskForm;