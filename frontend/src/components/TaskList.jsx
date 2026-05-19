import TaskCard from "./TaskCard";

/* ── Skeleton loader for a single card ── */
const SkeletonCard = ({ delay = 0 }) => (
  <>
    <style>{`
      .sk-card {
        background:rgba(15,20,35,0.7);
        border:1px solid rgba(255,255,255,0.06);
        border-radius:18px;
        padding:24px;
        animation:skPulse 1.6s ease-in-out infinite;
        animation-delay:var(--sk-delay);
      }
      @keyframes skPulse{0%,100%{opacity:.5}50%{opacity:.9}}
      .sk-line {
        border-radius:6px;
        background:rgba(255,255,255,0.06);
        margin-bottom:12px;
      }
      .sk-row { display:flex; gap:10px; margin-bottom:12px; }
    `}</style>
    <div className="sk-card" style={{ "--sk-delay": `${delay}s` }}>
      <div className="sk-row">
        <div className="sk-line" style={{ flex:1, height:"18px" }} />
        <div className="sk-line" style={{ width:"64px", height:"22px", borderRadius:"100px" }} />
      </div>
      <div className="sk-line" style={{ height:"13px", width:"90%" }} />
      <div className="sk-line" style={{ height:"13px", width:"70%", marginBottom:"20px" }} />
      <div className="sk-line" style={{ height:"4px", borderRadius:"100px", marginBottom:"18px" }} />
      <div className="sk-line" style={{ height:"42px", borderRadius:"12px", marginBottom:"14px" }} />
      <div className="sk-row" style={{ marginBottom:0 }}>
        <div className="sk-line" style={{ flex:1, height:"38px", borderRadius:"10px" }} />
        <div className="sk-line" style={{ flex:1, height:"38px", borderRadius:"10px" }} />
      </div>
    </div>
  </>
);

/* ── Empty state ── */
const EmptyState = () => (
  <>
    <style>{`
      .tl-empty {
        grid-column:1/-1;
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        padding:72px 32px;
        background:rgba(15,20,35,0.6);
        border:1px dashed rgba(255,255,255,0.08);
        border-radius:22px;
        text-align:center;
        font-family:'DM Sans',sans-serif;
      }
      .tl-empty-icon {
        width:72px; height:72px; border-radius:20px;
        background:rgba(99,102,241,0.08);
        border:1px solid rgba(99,102,241,0.15);
        display:flex; align-items:center; justify-content:center;
        font-size:32px; margin-bottom:22px;
        animation:emptyFloat 3s ease-in-out infinite alternate;
      }
      @keyframes emptyFloat{from{transform:translateY(0)}to{transform:translateY(-10px)}}
      .tl-empty h3 {
        font-family:'Playfair Display',serif;
        font-size:22px; font-weight:700; color:#f1f5f9; margin-bottom:10px;
      }
      .tl-empty p {
        font-size:14px; color:#475569; font-weight:300; max-width:280px; line-height:1.7;
      }
    `}</style>
    <div className="tl-empty">
      <div className="tl-empty-icon">📋</div>
      <h3>No tasks yet</h3>
      <p>Create your first task using the form — it'll appear here once added.</p>
    </div>
  </>
);

/* ── Main TaskList ── */
const TaskList = ({ tasks, loading, refreshTasks }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .tl-header {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:20px; flex-wrap:wrap; gap:12px;
          font-family:'DM Sans',sans-serif;
        }
        .tl-header-left { display:flex; align-items:center; gap:12px; }
        .tl-header-title {
          font-family:'Playfair Display',serif;
          font-size:20px; font-weight:700; color:#f1f5f9;
        }
        .tl-count {
          display:inline-flex; align-items:center; justify-content:center;
          min-width:26px; height:26px; padding:0 8px;
          border-radius:100px;
          background:rgba(129,140,248,0.12);
          border:1px solid rgba(129,140,248,0.2);
          font-size:12px; font-weight:500; color:#818cf8;
        }
        .tl-meta { font-size:12px; color:#334155; }

        .tl-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(300px,1fr));
          gap:18px;
        }

        /* stagger children */
        .tl-grid > *:nth-child(1){animation-delay:0s}
        .tl-grid > *:nth-child(2){animation-delay:.05s}
        .tl-grid > *:nth-child(3){animation-delay:.1s}
        .tl-grid > *:nth-child(4){animation-delay:.15s}
        .tl-grid > *:nth-child(5){animation-delay:.2s}
        .tl-grid > *:nth-child(6){animation-delay:.25s}
      `}</style>

      {/* Header row */}
      {!loading && (
        <div className="tl-header">
          <div className="tl-header-left">
            <span className="tl-header-title">Your Tasks</span>
            {tasks.length > 0 && (
              <span className="tl-count">{tasks.length}</span>
            )}
          </div>
          {tasks.length > 0 && (
            <span className="tl-meta">
              {tasks.filter(t => t.status === "Complete").length} of {tasks.length} complete
            </span>
          )}
        </div>
      )}

      <div className="tl-grid">
        {loading ? (
          [0, 0.1, 0.2, 0.3, 0.4, 0.5].map((d, i) => (
            <SkeletonCard key={i} delay={d} />
          ))
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} refreshTasks={refreshTasks} />
          ))
        )}
      </div>
    </>
  );
};

export default TaskList;