import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
        { token }
      );
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log("Login Error", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0b0f1a;
          overflow: hidden;
          position: relative;
        }

        /* ── Animated background ── */
        .login-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 90%, rgba(236,72,153,.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 60% 40%, rgba(34,211,238,.12) 0%, transparent 55%);
          animation: bgPulse 8s ease-in-out infinite alternate;
        }
        @keyframes bgPulse {
          from { opacity: .7; }
          to   { opacity: 1; }
        }

        /* ── Grid texture ── */
        .login-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* ── Floating orbs ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .orb-1 { width:420px; height:420px; top:-120px; left:-100px; background:rgba(99,102,241,.3); animation-duration:14s; }
        .orb-2 { width:340px; height:340px; bottom:-80px; right:-80px; background:rgba(236,72,153,.25); animation-duration:10s; animation-delay:-4s; }
        .orb-3 { width:250px; height:250px; top:45%; left:55%; background:rgba(34,211,238,.2); animation-duration:12s; animation-delay:-7s; }
        @keyframes float {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-40px) scale(1.08); }
        }

        /* ── Left brand panel ── */
        .login-brand {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          position: relative;
          z-index: 2;
        }
        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,.15);
          border: 1px solid rgba(99,102,241,.35);
          border-radius: 100px;
          padding: 6px 16px;
          width: fit-content;
          margin-bottom: 40px;
        }
        .badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 8px #818cf8;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:.3; }
        }
        .badge-text {
          font-size: 12px;
          font-weight: 500;
          color: #a5b4fc;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .brand-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.1;
          margin-bottom: 24px;
        }
        .brand-title span {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .brand-desc {
          font-size: 17px;
          color: #94a3b8;
          line-height: 1.75;
          max-width: 420px;
          margin-bottom: 56px;
        }
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          animation: slideIn .5s ease both;
        }
        .feature-item:nth-child(1) { animation-delay:.1s; }
        .feature-item:nth-child(2) { animation-delay:.2s; }
        .feature-item:nth-child(3) { animation-delay:.3s; }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .feature-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(129,140,248,.12);
          border: 1px solid rgba(129,140,248,.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .feature-text {
          font-size: 15px;
          color: #cbd5e1;
          font-weight: 300;
        }

        /* ── Right card panel ── */
        .login-card-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 64px;
          position: relative;
          z-index: 2;
        }
        .login-card {
          width: 380px;
          background: rgba(15,20,35,.75);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(129,140,248,.08),
            0 32px 64px rgba(0,0,0,.5),
            inset 0 1px 0 rgba(255,255,255,.07);
          animation: cardIn .6s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(32px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        .card-icon {
          width: 54px; height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          margin-bottom: 28px;
          box-shadow: 0 8px 24px rgba(99,102,241,.4);
        }

        .card-heading {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 8px;
        }
        .card-sub {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 36px;
          font-weight: 300;
        }

        /* ── Divider ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,.07);
        }
        .divider-label {
          font-size: 11px;
          color: #475569;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        /* ── Google button ── */
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 24px;
          border-radius: 12px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.12);
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background .2s, border-color .2s, transform .15s, box-shadow .2s;
          position: relative;
          overflow: hidden;
        }
        .btn-google::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,.2), rgba(236,72,153,.15));
          opacity: 0;
          transition: opacity .25s;
        }
        .btn-google:hover {
          background: rgba(255,255,255,.08);
          border-color: rgba(129,140,248,.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,.25);
        }
        .btn-google:hover::before { opacity: 1; }
        .btn-google:active { transform: translateY(0); }

        .google-svg {
          width: 20px; height: 20px; flex-shrink: 0; position: relative; z-index: 1;
        }
        .btn-label { position: relative; z-index: 1; }

        /* ── Footer note ── */
        .card-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 12px;
          color: #334155;
          line-height: 1.6;
        }
        .card-footer a {
          color: #818cf8;
          text-decoration: none;
        }
        .card-footer a:hover { text-decoration: underline; }

        /* ── Stats row ── */
        .stats-row {
          display: flex;
          gap: 24px;
          margin-top: 28px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,.06);
        }
        .stat {
          flex: 1;
          text-align: center;
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #f1f5f9;
          margin-bottom: 2px;
        }
        .stat-label {
          font-size: 11px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .login-brand { display: none; }
          .login-card-wrap { padding: 24px; flex: 1; }
          .login-card { width: 100%; max-width: 400px; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-bg" />
        <div className="login-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* ── Brand / Left ── */}
        <div className="login-brand">
          <div className="brand-badge">
            <span className="badge-dot" />
            <span className="badge-text">Now live</span>
          </div>

          <h1 className="brand-title">
            Manage tasks<br />
            with <span>clarity.</span>
          </h1>

          <p className="brand-desc">
            A focused workspace to plan, prioritise, and ship work — without the noise.
          </p>

          <ul className="feature-list">
            {[
              { icon: "⚡", text: "Real-time updates across all your devices" },
              { icon: "🗂️", text: "Organise by project, priority, or deadline" },
              { icon: "🔒", text: "Secure Google sign-in — no passwords" },
            ].map(({ icon, text }) => (
              <li key={text} className="feature-item">
                <span className="feature-icon">{icon}</span>
                <span className="feature-text">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Card / Right ── */}
        <div className="login-card-wrap">
          <div className="login-card">
            <div className="card-icon">✓</div>

            <h2 className="card-heading">Welcome back</h2>
            <p className="card-sub">Sign in to your workspace</p>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-label">continue with</span>
              <span className="divider-line" />
            </div>

            <button className="btn-google" onClick={loginWithGoogle}>
              {/* Official Google coloured G */}
              <svg className="google-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="btn-label">Sign in with Google</span>
            </button>

            <div className="stats-row">
              <div className="stat">
                <div className="stat-num">∞</div>
                <div className="stat-label">Tasks</div>
              </div>
              <div className="stat">
                <div className="stat-num">0¢</div>
                <div className="stat-label">Free</div>
              </div>
              <div className="stat">
                <div className="stat-num">100%</div>
                <div className="stat-label">Private</div>
              </div>
            </div>

            <p className="card-footer">
              By signing in you agree to our{" "}
              <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;