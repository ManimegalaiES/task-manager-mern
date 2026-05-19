import { useState } from "react";
import { deleteTask, updateTaskStatus } from "../api/taskApi";
import EditTaskModal from "./EditTaskModal";

/* ── helpers ── */
const PRIORITY_META = {
  High:   { color: "#f87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   dot: "#ef4444", label: "High"   },
  Medium: { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)",  dot: "#f97316", label: "Medium" },
  Low:    { color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)",  dot: "#10b981", label: "Low"    },
};

const STATUS_META = {
  "Planned":     { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", bar: 0   },
  "In Progress": { color: "#818cf8", bg: "rgba(129,140,248,0.10)", bar: 50  },
  "Complete":    { color: "#34d399", bg: "rgba(52,211,153,0.10)",  bar: 100 },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && true;
}

/* ── Component ── */
const TaskCard = ({ task, refreshTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const priority = PRIORITY_META[task.priority] || PRIORITY_META.Low;
  const status   = STATUS_META[task.status]     || STATUS_META["Planned"];
  const overdue  = task.status !== "Complete" && isOverdue(task.dueDate);

  const handleStatusChange = async (e) => {
    setUpdating(true);
    try {
      await updateTaskStatus(task._id, e.target.value);
      refreshTasks();
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    try {
      await deleteTask(task._id);
      refreshTasks();
    } catch {
      alert("Failed to delete task");
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .tc-card {
          font-family: 'DM Sans', sans-serif;
          background: rgba(15,20,35,0.75);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.22s cubic-bezier(.16,1,.3,1), box-shadow 0.22s, border-color 0.22s;
          animation: cardIn 0.4s cubic-bezier(.16,1,.3,1) both;
        }
        .tc-card:hover {
          transform: translateY(-4px);
          border-color: rgba(129,140,248,0.22);
          box-shadow: 0 20px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(129,140,248,0.1);
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* priority left-border accent */
        .tc-card::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: var(--tc-accent);
          opacity: 0.8;
        }

        /* header */
        .tc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }
        .tc-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 600;
          color: #f1f5f9;
          line-height: 1.3;
          flex: 1;
        }

        /* priority badge */
        .tc-priority {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          border: 1px solid var(--tc-p-border);
          background: var(--tc-p-bg);
          color: var(--tc-p-color);
        }
        .tc-priority-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--tc-p-dot);
          box-shadow: 0 0 6px var(--tc-p-dot);
        }

        /* description */
        .tc-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.65;
          margin-bottom: 16px;
          font-weight: 300;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* meta row */
        .tc-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .tc-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #475569;
          font-weight: 400;
        }
        .tc-meta-item svg { flex-shrink: 0; }
        .tc-meta-item.overdue { color: #f87171; }

        /* progress */
        .tc-progress-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .tc-progress-label {
          font-size: 11px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .tc-progress-pct {
          font-size: 11px;
          font-weight: 500;
          color: var(--tc-s-color);
        }
        .tc-progress-track {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .tc-progress-fill {
          height: 100%;
          border-radius: 100px;
          background: var(--tc-s-color);
          box-shadow: 0 0 8px var(--tc-s-color);
          transition: width 0.6s cubic-bezier(.16,1,.3,1);
        }

        /* status select */
        .tc-select-wrap {
          position: relative;
          margin-bottom: 18px;
        }
        .tc-select-label {
          font-size: 11px;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
          display: block;
        }
        .tc-select {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 36px 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--tc-s-color);
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .tc-select:hover, .tc-select:focus {
          border-color: rgba(129,140,248,0.35);
          background: rgba(129,140,248,0.05);
        }
        .tc-select option { background: #0f1627; color: #e2e8f0; }
        .tc-select-arrow {
          position: absolute;
          right: 12px;
          bottom: 12px;
          pointer-events: none;
          color: #475569;
        }
        .tc-select.updating { opacity: 0.6; pointer-events: none; }

        /* action buttons */
        .tc-actions {
          display: flex;
          gap: 10px;
        }
        .tc-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 14px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .tc-btn:hover { transform: translateY(-1px); }
        .tc-btn:active { transform: translateY(0); }
        .tc-btn-edit {
          background: rgba(129,140,248,0.1);
          border-color: rgba(129,140,248,0.2);
          color: #a5b4fc;
        }
        .tc-btn-edit:hover {
          background: rgba(129,140,248,0.18);
          border-color: rgba(129,140,248,0.4);
        }
        .tc-btn-delete {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.18);
          color: #f87171;
        }
        .tc-btn-delete:hover {
          background: rgba(239,68,68,0.16);
          border-color: rgba(239,68,68,0.35);
        }
        .tc-btn:disabled { opacity:0.5; pointer-events:none; }

        /* complete overlay shimmer */
        .tc-card.complete .tc-title { color: #475569; text-decoration: line-through; }
      `}</style>

      <div
        className={`tc-card${task.status === "Complete" ? " complete" : ""}`}
        style={{
          "--tc-accent":   priority.dot,
          "--tc-p-color":  priority.color,
          "--tc-p-bg":     priority.bg,
          "--tc-p-border": priority.border,
          "--tc-p-dot":    priority.dot,
          "--tc-s-color":  status.color,
          "--tc-s-bg":     status.bg,
        }}
      >
        {/* Header */}
        <div className="tc-header">
          <h3 className="tc-title">{task.title}</h3>
          <span className="tc-priority">
            <span className="tc-priority-dot" />
            {priority.label}
          </span>
        </div>

        {/* Description */}
        <p className="tc-desc">{task.description || "No description provided."}</p>

        {/* Meta */}
        <div className="tc-meta">
          <span className={`tc-meta-item${overdue ? " overdue" : ""}`}>
            {/* calendar icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {task.dueDate ? formatDate(task.dueDate) : "No due date"}
            {overdue && " · Overdue"}
          </span>

          {task.status === "Complete" && (
            <span className="tc-meta-item" style={{ color: "#34d399" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Done
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="tc-progress-row">
          <span className="tc-progress-label">Progress</span>
          <span className="tc-progress-pct">{status.bar}%</span>
        </div>
        <div className="tc-progress-track">
          <div className="tc-progress-fill" style={{ width: `${status.bar}%` }} />
        </div>

        {/* Status select */}
        <div className="tc-select-wrap">
          <label className="tc-select-label">Status</label>
          <select
            value={task.status}
            onChange={handleStatusChange}
            className={`tc-select${updating ? " updating" : ""}`}
            disabled={updating}
          >
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
          <svg className="tc-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        {/* Actions */}
        <div className="tc-actions">
          <button className="tc-btn tc-btn-edit" onClick={() => setShowModal(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button className="tc-btn tc-btn-delete" onClick={handleDelete} disabled={deleting}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {showModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowModal(false)}
          refreshTasks={refreshTasks}
        />
      )}
    </>
  );
};

export default TaskCard;