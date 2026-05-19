const SearchFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearAll = () => {
    setFilters({ search: "", priority: "", status: "" });
  };

  const hasActiveFilters = filters.search || filters.priority || filters.status;

  const PRIORITY_OPTS = [
    { value: "",       label: "All",    color: "#64748b" },
    { value: "Low",    label: "Low",    color: "#34d399" },
    { value: "Medium", label: "Medium", color: "#fb923c" },
    { value: "High",   label: "High",   color: "#f87171" },
  ];

  const STATUS_OPTS = [
    { value: "",            label: "All",         color: "#64748b" },
    { value: "Planned",     label: "Planned",     color: "#94a3b8" },
    { value: "In Progress", label: "In Progress", color: "#818cf8" },
    { value: "Complete",    label: "Complete",    color: "#34d399" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .sf-wrap {
          font-family:'DM Sans',sans-serif;
          background:rgba(15,20,35,.75);
          border:1px solid rgba(255,255,255,.08);
          border-radius:18px;
          padding:22px 24px;
          backdrop-filter:blur(16px);
          -webkit-backdrop-filter:blur(16px);
          margin-bottom:18px;
          box-shadow:0 8px 32px rgba(0,0,0,.3);
        }

        .sf-header {
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:18px;
        }
        .sf-header-left {
          display:flex;align-items:center;gap:10px;
        }
        .sf-header-icon {
          width:32px;height:32px;border-radius:9px;
          background:rgba(129,140,248,.1);
          border:1px solid rgba(129,140,248,.2);
          display:flex;align-items:center;justify-content:center;
          color:#818cf8;font-size:14px;
        }
        .sf-header-title {
          font-size:14px;font-weight:500;color:#94a3b8;
          text-transform:uppercase;letter-spacing:.08em;
        }

        .sf-clear {
          display:flex;align-items:center;gap:6px;
          padding:6px 12px;border-radius:8px;
          background:rgba(239,68,68,.08);
          border:1px solid rgba(239,68,68,.18);
          color:#f87171;
          font-family:'DM Sans',sans-serif;
          font-size:12px;font-weight:500;
          cursor:pointer;
          transition:background .18s,border-color .18s;
          opacity:0;pointer-events:none;
          transition:opacity .2s,background .18s;
        }
        .sf-clear.visible { opacity:1;pointer-events:auto; }
        .sf-clear:hover {
          background:rgba(239,68,68,.15);
          border-color:rgba(239,68,68,.3);
        }

        /* ── Row layout ── */
        .sf-row {
          display:grid;
          grid-template-columns:1fr auto auto;
          gap:12px;
          align-items:start;
        }
        @media(max-width:700px){ .sf-row{grid-template-columns:1fr;} }

        /* ── Search field ── */
        .sf-search-wrap { position:relative; }
        .sf-search-icon {
          position:absolute;left:14px;top:50%;transform:translateY(-50%);
          color:#334155;pointer-events:none;
        }
        .sf-search {
          width:100%;
          font-family:'DM Sans',sans-serif;
          font-size:14px;font-weight:400;color:#e2e8f0;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          border-radius:12px;
          padding:11px 16px 11px 42px;
          outline:none;
          transition:border-color .2s,background .2s,box-shadow .2s;
        }
        .sf-search::placeholder { color:#334155; }
        .sf-search:focus {
          border-color:rgba(129,140,248,.5);
          background:rgba(129,140,248,.06);
          box-shadow:0 0 0 3px rgba(99,102,241,.12);
        }

        /* ── Dropdown groups ── */
        .sf-dropdown-group { display:flex;flex-direction:column;gap:0; }
        .sf-dropdown-label {
          font-size:10px;color:#334155;
          text-transform:uppercase;letter-spacing:.09em;
          margin-bottom:5px;padding-left:2px;
        }

        /* ── Chip selects ── */
        .sf-chips { display:flex;gap:6px;flex-wrap:wrap; }
        .sf-chip {
          padding:7px 13px;border-radius:100px;
          font-family:'DM Sans',sans-serif;
          font-size:12px;font-weight:500;
          cursor:pointer;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          color:#64748b;
          display:flex;align-items:center;gap:5px;
          transition:all .18s;
          white-space:nowrap;
        }
        .sf-chip:hover { background:rgba(255,255,255,.07);color:#94a3b8; }
        .sf-chip.active {
          background:rgba(var(--c-rgb),.12);
          border-color:rgba(var(--c-rgb),.35);
          color:var(--c-color);
          box-shadow:0 0 12px rgba(var(--c-rgb),.12);
        }
        .sf-chip-dot {
          width:6px;height:6px;border-radius:50%;
          background:currentColor;
          display:inline-block;
        }

        /* ── Active filter pills row ── */
        .sf-active-row {
          display:flex;gap:8px;flex-wrap:wrap;
          margin-top:14px;padding-top:14px;
          border-top:1px solid rgba(255,255,255,.05);
        }
        .sf-active-pill {
          display:inline-flex;align-items:center;gap:6px;
          padding:4px 10px 4px 12px;border-radius:100px;
          background:rgba(129,140,248,.1);
          border:1px solid rgba(129,140,248,.2);
          font-size:12px;color:#a5b4fc;
        }
        .sf-active-remove {
          cursor:pointer;color:#818cf8;font-size:14px;line-height:1;
          transition:color .15s;display:flex;align-items:center;
        }
        .sf-active-remove:hover { color:#f87171; }
      `}</style>

      <div className="sf-wrap">
        {/* Header */}
        <div className="sf-header">
          <div className="sf-header-left">
            <div className="sf-header-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <span className="sf-header-title">Filter Tasks</span>
          </div>
          <button className={`sf-clear${hasActiveFilters ? " visible" : ""}`} onClick={clearAll}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear all
          </button>
        </div>

        {/* Controls */}
        <div className="sf-row">
          {/* Search */}
          <div className="sf-search-wrap">
            <svg className="sf-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search tasks…"
              className="sf-search"
            />
          </div>

          {/* Priority chips */}
          <div className="sf-dropdown-group">
            <span className="sf-dropdown-label">Priority</span>
            <div className="sf-chips">
              {PRIORITY_OPTS.map(({ value, label, color }) => {
                const rgb = value === "Low" ? "52,211,153" : value === "Medium" ? "251,146,60" : value === "High" ? "248,113,113" : "100,116,139";
                return (
                  <button
                    key={value}
                    className={`sf-chip${filters.priority === value ? " active" : ""}`}
                    style={{ "--c-color": color, "--c-rgb": rgb }}
                    onClick={() => setFilters(prev => ({ ...prev, priority: value }))}
                  >
                    {value && <span className="sf-chip-dot" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status chips */}
          <div className="sf-dropdown-group">
            <span className="sf-dropdown-label">Status</span>
            <div className="sf-chips">
              {STATUS_OPTS.map(({ value, label, color }) => {
                const rgb = value === "Planned" ? "148,163,184" : value === "In Progress" ? "129,140,248" : value === "Complete" ? "52,211,153" : "100,116,139";
                return (
                  <button
                    key={value}
                    className={`sf-chip${filters.status === value ? " active" : ""}`}
                    style={{ "--c-color": color, "--c-rgb": rgb }}
                    onClick={() => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    {value && <span className="sf-chip-dot" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="sf-active-row">
            {filters.search && (
              <span className="sf-active-pill">
                Search: "{filters.search}"
                <span className="sf-active-remove" onClick={() => setFilters(p => ({ ...p, search: "" }))}>✕</span>
              </span>
            )}
            {filters.priority && (
              <span className="sf-active-pill">
                Priority: {filters.priority}
                <span className="sf-active-remove" onClick={() => setFilters(p => ({ ...p, priority: "" }))}>✕</span>
              </span>
            )}
            {filters.status && (
              <span className="sf-active-pill">
                Status: {filters.status}
                <span className="sf-active-remove" onClick={() => setFilters(p => ({ ...p, status: "" }))}>✕</span>
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchFilter;