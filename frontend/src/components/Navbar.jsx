import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 68px;
          background: rgba(11, 15, 26, 0.85);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 14px rgba(99,102,241,0.4);
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 19px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }
        .nav-logo-text span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Right section */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* User pill */
        .nav-user {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          padding: 6px 16px 6px 6px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-user:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(129,140,248,0.3);
        }
        .nav-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(129,140,248,0.5);
          display: block;
        }
        .nav-avatar-fallback {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #c084fc);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; color: #fff;
          border: 2px solid rgba(129,140,248,0.5);
          flex-shrink: 0;
        }
        .nav-user-info {
          display: flex;
          flex-direction: column;
        }
        .nav-user-name {
          font-size: 13px;
          font-weight: 500;
          color: #e2e8f0;
          line-height: 1.2;
        }
        .nav-user-email {
          font-size: 11px;
          color: #475569;
          line-height: 1.2;
        }

        /* Logout button */
        .btn-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .btn-logout:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.4);
          transform: translateY(-1px);
        }
        .btn-logout:active { transform: translateY(0); }

        /* Progress bar accent */
        .navbar-accent {
          height: 2px;
          background: linear-gradient(90deg, #4f46e5, #c084fc, #f472b6);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 640px) {
          .nav-user-info { display: none; }
          .navbar-inner { padding: 0 16px; }
          .btn-logout span { display: none; }
          .btn-logout { padding: 9px 12px; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-accent" />
        <div className="navbar-inner">
          {/* Logo */}
          <div className="nav-logo">
            <div className="nav-logo-icon">✓</div>
            <span className="nav-logo-text">
              Task<span>Flow</span>
            </span>
          </div>

          {/* Right */}
          <div className="nav-right">
            {/* User pill */}
            <div className="nav-user">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="nav-avatar"
                />
              ) : (
                <div className="nav-avatar-fallback">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className="nav-user-info">
                <span className="nav-user-name">{user?.name}</span>
                <span className="nav-user-email">{user?.email}</span>
              </div>
            </div>

            {/* Logout */}
            <button className="btn-logout" onClick={handleLogout}>
              {/* power icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;