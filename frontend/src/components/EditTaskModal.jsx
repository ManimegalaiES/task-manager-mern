import { useState } from "react";
import { editTask } from "../api/taskApi";

const EditTaskModal = ({ task, onClose, refreshTasks }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "Medium",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    try {
      setLoading(true);
      await editTask(task._id, formData);
      refreshTasks();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const PRIORITY_OPTS = [
    { value: "Low",    color: "#34d399", rgb: "52,211,153"  },
    { value: "Medium", color: "#fb923c", rgb: "251,146,60"  },
    { value: "High",   color: "#f87171", rgb: "248,113,113" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .etm-overlay {
          position:fixed; inset:0; z-index:999;
          background:rgba(0,0,0,0.65);
          backdrop-filter:blur(6px);
          -webkit-backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center;
          padding:20px;
          animation:etmFadeIn 0.2s ease;
        }
        @keyframes etmFadeIn { from{opacity:0} to{opacity:1} }

        .etm-panel {
          font-family:'DM Sans',sans-serif;
          width:100%; max-width:520px;
          background:rgba(13,18,30,0.95);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:24px;
          padding:36px;
          box-shadow:0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07);
          position:relative; overflow:hidden;
          animation:etmSlideUp 0.28s cubic-bezier(.16,1,.3,1);
        }
        @keyframes etmSlideUp {
          from{opacity:0;transform:translateY(24px) scale(.97)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        .etm-panel::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#4f46e5,#c084fc,#f472b6);
          background-size:200% 100%;
          animation:etmShimmer 3s linear infinite;
        }
        @keyframes etmShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* Header */
        .etm-header {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:28px;
        }
        .etm-header-left { display:flex; align-items:center; gap:12px; }
        .etm-icon {
          width:40px; height:40px; border-radius:11px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 6px 18px rgba(99,102,241,0.4);
          font-size:17px; flex-shrink:0;
        }
        .etm-title {
          font-family:'Playfair Display',serif;
          font-size:21px; font-weight:700; color:#f1f5f9;
        }
        .etm-subtitle { font-size:12px; color:#475569; font-weight:300; margin-top:1px; }

        .etm-close {
          width:34px; height:34px; border-radius:9px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          color:#64748b; font-size:18px;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;
          transition:background 0.18s,color 0.18s,border-color 0.18s;
        }
        .etm-close:hover {
          background:rgba(239,68,68,0.12);
          border-color:rgba(239,68,68,0.25);
          color:#f87171;
        }

        /* Divider */
        .etm-divider {
          height:1px; background:rgba(255,255,255,0.06); margin-bottom:24px;
        }

        /* Fields */
        .etm-field { margin-bottom:18px; }
        .etm-label {
          display:block; margin-bottom:7px;
          font-size:11px; font-weight:500; color:#64748b;
          text-transform:uppercase; letter-spacing:0.09em;
        }
        .etm-input, .etm-textarea, .etm-select {
          width:100%;
          font-family:'DM Sans',sans-serif;
          font-size:14px; font-weight:400; color:#e2e8f0;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:12px;
          padding:12px 16px;
          outline:none; resize:none;
          transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
        }
        .etm-input:focus,.etm-textarea:focus,.etm-select:focus {
          border-color:rgba(129,140,248,0.5);
          background:rgba(129,140,248,0.06);
          box-shadow:0 0 0 3px rgba(99,102,241,0.12);
        }
        .etm-select { appearance:none;-webkit-appearance:none;cursor:pointer; }
        .etm-select option { background:#0f1627; color:#e2e8f0; }

        /* Priority toggles */
        .etm-priority-group { display:flex; gap:8px; }
        .etm-priority-btn {
          flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
          padding:10px 8px; border-radius:11px;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
          cursor:pointer;
          border:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.03);
          color:#64748b;
          transition:all 0.18s;
        }
        .etm-priority-btn:hover { background:rgba(255,255,255,0.06); color:#94a3b8; }
        .etm-priority-btn.active {
          color:var(--p-color);
          border-color:var(--p-color);
          background:rgba(var(--p-rgb),0.1);
          box-shadow:0 0 14px rgba(var(--p-rgb),0.15);
        }
        .etm-priority-dot { width:7px;height:7px;border-radius:50%;background:currentColor; }

        /* Date */
        .etm-date-wrap { position:relative; }
        .etm-date-wrap svg {
          position:absolute;right:14px;top:50%;transform:translateY(-50%);
          color:#334155;pointer-events:none;
        }
        input[type="date"]::-webkit-calendar-picker-indicator{opacity:0;}

        /* Footer buttons */
        .etm-footer {
          display:flex; gap:10px; margin-top:24px;
          padding-top:20px;
          border-top:1px solid rgba(255,255,255,0.06);
        }
        .etm-btn {
          flex:1; padding:13px;
          border-radius:12px; border:none;
          font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
          cursor:pointer;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition:transform 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .etm-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .etm-btn:active:not(:disabled) { transform:translateY(0); }
        .etm-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .etm-btn-cancel {
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          color:#64748b;
        }
        .etm-btn-cancel:hover:not(:disabled) {
          background:rgba(255,255,255,0.09);
          color:#94a3b8;
        }
        .etm-btn-save {
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:#fff;
          box-shadow:0 6px 20px rgba(99,102,241,0.35);
        }
        .etm-btn-save:hover:not(:disabled) {
          box-shadow:0 12px 28px rgba(99,102,241,0.45);
        }

        .etm-spinner {
          width:15px;height:15px;
          border:2px solid rgba(255,255,255,0.3);
          border-top-color:#fff;
          border-radius:50%;
          animation:etmSpin 0.7s linear infinite;
        }
        @keyframes etmSpin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="etm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="etm-panel">

          {/* Header */}
          <div className="etm-header">
            <div className="etm-header-left">
              <div className="etm-icon">✎</div>
              <div>
                <div className="etm-title">Edit Task</div>
                <div className="etm-subtitle">Update task details</div>
              </div>
            </div>
            <button className="etm-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div className="etm-divider" />

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="etm-field">
              <label className="etm-label">Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="etm-input"
                placeholder="Enter task title…"
              />
            </div>

            {/* Description */}
            <div className="etm-field">
              <label className="etm-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="etm-textarea"
                placeholder="Add more context (optional)…"
              />
            </div>

            {/* Priority */}
            <div className="etm-field">
              <label className="etm-label">Priority</label>
              <div className="etm-priority-group">
                {PRIORITY_OPTS.map(({ value, color, rgb }) => (
                  <button
                    key={value}
                    type="button"
                    className={`etm-priority-btn${formData.priority === value ? " active" : ""}`}
                    style={{ "--p-color": color, "--p-rgb": rgb }}
                    onClick={() => setFormData({ ...formData, priority: value })}
                  >
                    <span className="etm-priority-dot" />
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="etm-field">
              <label className="etm-label">Due Date</label>
              <div className="etm-date-wrap">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="etm-input"
                  style={{ paddingRight: "40px" }}
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>

            {/* Footer */}
            <div className="etm-footer">
              <button type="button" className="etm-btn etm-btn-cancel" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="etm-btn etm-btn-save" disabled={loading}>
                {loading ? (
                  <><div className="etm-spinner" /> Saving…</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default EditTaskModal;