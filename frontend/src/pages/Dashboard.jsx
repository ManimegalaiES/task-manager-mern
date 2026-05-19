import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import SearchFilter from "../components/SearchFilter";
import { getTasks } from "../api/taskApi";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", priority: "", status: "" });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(filters);
      setTasks(response.tasks);
    } catch (error) {
      console.log("Task Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchTasks(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [filters]);

  /* ── derived stats ── */
  const total      = tasks.length;
  const done       = tasks.filter(t => t.status === "Complete").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const highPrio   = tasks.filter(t => t.priority === "High" && t.status !== "Complete").length;
  const pct        = total ? Math.round((done / total) * 100) : 0;

  const STATS = [
    { label: "Total",       value: total,      color: "#818cf8", rgb: "129,140,248", icon: "◈" },
    { label: "In Progress", value: inProgress,  color: "#fb923c", rgb: "251,146,60",  icon: "⟳" },
    { label: "Completed",   value: done,        color: "#34d399", rgb: "52,211,153",  icon: "✓" },
    { label: "High Priority",value: highPrio,   color: "#f87171", rgb: "248,113,113", icon: "↑" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: #0b0f1a;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ── ambient blobs ── */
        .db-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
          animation: dbFloat 14s ease-in-out infinite alternate;
        }
        .db-blob-1 { width:500px;height:500px;top:-160px;left:-160px;background:rgba(99,102,241,.18);animation-duration:16s; }
        .db-blob-2 { width:400px;height:400px;bottom:-100px;right:-100px;background:rgba(236,72,153,.13);animation-duration:12s;animation-delay:-5s; }
        .db-blob-3 { width:300px;height:300px;top:40%;left:42%;background:rgba(34,211,238,.09);animation-duration:18s;animation-delay:-9s; }
        @keyframes dbFloat { from{transform:scale(1) translate(0,0)} to{transform:scale(1.1) translate(20px,-20px)} }

        /* ── grid texture ── */
        .db-grid {
          position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
          background-size:52px 52px;
        }

        .db-content { position:relative;z-index:1; }

        /* ── stat cards ── */
        .db-stats {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
          padding:20px 28px 0;
        }
        @media(max-width:900px){ .db-stats{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:500px){ .db-stats{grid-template-columns:1fr 1fr;} }

        .db-stat {
          background:rgba(15,20,35,.75);
          border:1px solid rgba(255,255,255,.07);
          border-radius:16px;
          padding:18px 20px;
          backdrop-filter:blur(16px);
          -webkit-backdrop-filter:blur(16px);
          display:flex;align-items:center;gap:14px;
          transition:transform .2s,border-color .2s,box-shadow .2s;
          animation:statIn .5s cubic-bezier(.16,1,.3,1) both;
        }
        .db-stat:nth-child(1){animation-delay:.05s}
        .db-stat:nth-child(2){animation-delay:.1s}
        .db-stat:nth-child(3){animation-delay:.15s}
        .db-stat:nth-child(4){animation-delay:.2s}
        @keyframes statIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .db-stat:hover{
          transform:translateY(-3px);
          border-color:rgba(var(--st-rgb),.25);
          box-shadow:0 12px 32px rgba(0,0,0,.35),0 0 0 1px rgba(var(--st-rgb),.1);
        }
        .db-stat-icon {
          width:42px;height:42px;border-radius:12px;
          background:rgba(var(--st-rgb),.12);
          border:1px solid rgba(var(--st-rgb),.2);
          display:flex;align-items:center;justify-content:center;
          font-size:18px;color:var(--st-color);
          flex-shrink:0;
        }
        .db-stat-val {
          font-family:'Playfair Display',serif;
          font-size:26px;font-weight:700;color:#f1f5f9;line-height:1;
        }
        .db-stat-label {
          font-size:12px;color:#475569;font-weight:400;margin-top:3px;
        }

        /* ── progress bar ── */
        .db-progress-wrap {
          padding:16px 28px 0;
        }
        .db-progress-bar-outer {
          height:5px;background:rgba(255,255,255,.06);border-radius:100px;overflow:hidden;
        }
        .db-progress-bar-fill {
          height:100%;border-radius:100px;
          background:linear-gradient(90deg,#4f46e5,#c084fc,#34d399);
          transition:width .8s cubic-bezier(.16,1,.3,1);
          box-shadow:0 0 10px rgba(129,140,248,.4);
        }
        .db-progress-label {
          display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;
          font-size:12px;color:#475569;
        }
        .db-progress-pct { color:#818cf8;font-weight:500; }

        /* ── main layout ── */
        .db-layout {
          display:grid;
          grid-template-columns:340px 1fr;
          gap:20px;
          padding:20px 28px 40px;
        }
        @media(max-width:1024px){ .db-layout{grid-template-columns:1fr;} }

        /* ── section heading ── */
        .db-section-head {
          margin-bottom:18px;
        }
        .db-section-head h1 {
          font-family:'Playfair Display',serif;
          font-size:24px;font-weight:700;color:#f1f5f9;margin-bottom:4px;
        }
        .db-section-head p { font-size:13px;color:#475569;font-weight:300; }
      `}</style>

      <div className="db-root">
        {/* Background */}
        <div className="db-blob db-blob-1" />
        <div className="db-blob db-blob-2" />
        <div className="db-blob db-blob-3" />
        <div className="db-grid" />

        <div className="db-content">
          {/* Navbar */}
          <Navbar />

          {/* Stat Cards */}
          <div className="db-stats">
            {STATS.map(({ label, value, color, rgb, icon }) => (
              <div
                key={label}
                className="db-stat"
                style={{ "--st-color": color, "--st-rgb": rgb }}
              >
                <div className="db-stat-icon">{icon}</div>
                <div>
                  <div className="db-stat-val">{value}</div>
                  <div className="db-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="db-progress-wrap">
            <div className="db-progress-label">
              <span>Overall Progress</span>
              <span className="db-progress-pct">{pct}% complete</span>
            </div>
            <div className="db-progress-bar-outer">
              <div className="db-progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Main grid */}
          <div className="db-layout">
            {/* Left – Task Form */}
            <div>
              <TaskForm refreshTasks={fetchTasks} />
            </div>

            {/* Right – Filters + List */}
            <div>
              <div className="db-section-head">
                <h1>Your Tasks</h1>
                <p>Manage and track your daily work</p>
              </div>

              <SearchFilter filters={filters} setFilters={setFilters} />
              <TaskList tasks={tasks} loading={loading} refreshTasks={fetchTasks} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;