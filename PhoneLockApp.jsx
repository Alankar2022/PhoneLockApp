 import { useState, useEffect, useRef } from "react";

const CORRECT_PIN = "1234";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;600&family=Rubik:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .phone-shell {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #0a0a0a;
    font-family: 'Rubik', sans-serif;
  }

  .phone {
    width: 375px;
    height: 812px;
    background: #000;
    border-radius: 54px;
    overflow: hidden;
    position: relative;
    box-shadow:
      0 0 0 2px #2a2a2a,
      0 0 0 4px #1a1a1a,
      0 40px 100px rgba(0,0,0,0.8),
      inset 0 0 0 1px rgba(255,255,255,0.05);
  }

  /* Dynamic Island */
  .dynamic-island {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 34px;
    background: #000;
    border-radius: 20px;
    z-index: 100;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
  }

  /* ===== LOCK SCREEN ===== */
  .lock-screen {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(160deg, #0d1b2e 0%, #1a1040 40%, #0d1b2e 100%);
    overflow: hidden;
  }

  .lock-bg-glow {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100,80,200,0.15) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .lock-stars {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: twinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s);
  }

  @keyframes twinkle {
    0%, 100% { opacity: var(--min-op, 0.2); }
    50% { opacity: var(--max-op, 0.8); }
  }

  .lock-time-block {
    margin-top: 90px;
    text-align: center;
    z-index: 2;
  }

  .lock-time {
    font-size: 80px;
    font-weight: 200;
    color: white;
    letter-spacing: -3px;
    line-height: 1;
    font-family: 'Rubik', sans-serif;
  }

  .lock-date {
    font-size: 18px;
    color: rgba(255,255,255,0.7);
    font-weight: 300;
    margin-top: 6px;
    letter-spacing: 0.5px;
  }

  .lock-icon-wrap {
    margin-top: 44px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .lock-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .lock-icon:hover {
    background: rgba(255,255,255,0.14);
    transform: scale(1.05);
  }

  .lock-hint {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.5px;
  }

  .swipe-hint {
    position: absolute;
    bottom: 50px;
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    animation: pulse-up 2s ease-in-out infinite;
  }

  @keyframes pulse-up {
    0%, 100% { opacity: 0.45; transform: translateY(0); }
    50% { opacity: 0.7; transform: translateY(-4px); }
  }

  /* ===== PIN SCREEN ===== */
  .pin-screen {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #0d1b2e 0%, #0a0a18 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .pin-header {
    margin-top: 90px;
    text-align: center;
  }

  .pin-title {
    font-size: 22px;
    font-weight: 400;
    color: white;
    letter-spacing: 0.2px;
  }

  .pin-subtitle {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    margin-top: 4px;
  }

  .pin-dots {
    display: flex;
    gap: 18px;
    margin-top: 48px;
  }

  .pin-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.4);
    background: transparent;
    transition: all 0.15s ease;
  }

  .pin-dot.filled {
    background: white;
    border-color: white;
    transform: scale(1.1);
  }

  .pin-dot.error {
    background: #ff4444;
    border-color: #ff4444;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  .pin-dot.success {
    background: #34c759;
    border-color: #34c759;
  }

  .numpad {
    margin-top: 56px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 280px;
  }

  .num-btn {
    height: 72px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    font-family: 'Rubik', sans-serif;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.1s ease;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    overflow: hidden;
  }

  .num-btn:hover { background: rgba(255,255,255,0.17); }

  .num-btn:active, .num-btn.pressed {
    background: rgba(255,255,255,0.3);
    transform: scale(0.94);
  }

  .num-btn .digit {
    font-size: 26px;
    font-weight: 300;
    line-height: 1;
  }

  .num-btn .letters {
    font-size: 9px;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.5);
    margin-top: 2px;
    font-weight: 400;
  }

  .num-btn.empty {
    background: transparent;
    cursor: default;
    pointer-events: none;
  }

  .num-btn.delete-btn {
    background: transparent;
    font-size: 22px;
  }

  .num-btn.delete-btn:hover { background: rgba(255,255,255,0.08); }

  .cancel-btn {
    margin-top: 24px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    font-family: 'Rubik', sans-serif;
    font-size: 15px;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: color 0.2s;
  }

  .cancel-btn:hover { color: rgba(255,255,255,0.8); }

  /* ===== HOME SCREEN ===== */
  .home-screen {
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, #1a2a3a 0%, #0d1520 50%, #1a1040 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    animation: homeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes homeIn {
    from { opacity: 0; transform: scale(1.04); }
    to { opacity: 1; transform: scale(1); }
  }

  .home-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 28px 0;
    color: white;
    font-size: 13px;
    font-weight: 500;
    z-index: 2;
  }

  .home-time-small {
    font-size: 15px;
    font-weight: 500;
  }

  .status-icons {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
  }

  .home-wallpaper-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .home-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.12;
  }

  .home-greeting {
    margin-top: 80px;
    text-align: center;
    z-index: 2;
    padding: 0 30px;
  }

  .home-greeting-label {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 400;
  }

  .home-greeting-name {
    font-size: 36px;
    font-weight: 300;
    color: white;
    margin-top: 4px;
    letter-spacing: -0.5px;
  }

  .unlocked-badge {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(52, 199, 89, 0.15);
    border: 1px solid rgba(52, 199, 89, 0.3);
    border-radius: 20px;
    padding: 8px 18px;
    color: #34c759;
    font-size: 14px;
    font-weight: 400;
    z-index: 2;
  }

  .app-grid {
    margin-top: 48px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 0 24px;
    z-index: 2;
    width: 100%;
  }

  .app-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  .app-icon:hover { transform: scale(1.08); }
  .app-icon:active { transform: scale(0.94); }

  .app-icon-face {
    width: 58px;
    height: 58px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  .app-icon-label {
    font-size: 10px;
    color: rgba(255,255,255,0.75);
    text-align: center;
    font-weight: 400;
  }

  .lock-again-btn {
    position: absolute;
    bottom: 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 10;
  }

  .lock-again-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 28px;
    padding: 12px 28px;
    color: white;
    font-size: 15px;
    font-weight: 400;
    cursor: pointer;
    font-family: 'Rubik', sans-serif;
    backdrop-filter: blur(12px);
    transition: all 0.2s ease;
  }

  .lock-again-inner:hover {
    background: rgba(255,255,255,0.18);
    transform: translateY(-1px);
  }

  .dock {
    position: absolute;
    bottom: 10px;
    width: calc(100% - 40px);
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    padding: 12px 20px;
    display: flex;
    justify-content: space-around;
    z-index: 5;
  }

  /* PIN error msg */
  .pin-error-msg {
    margin-top: 16px;
    font-size: 13px;
    color: #ff4444;
    height: 18px;
    transition: opacity 0.3s;
  }

  .attempts-left {
    font-size: 12px;
    color: rgba(255,150,100,0.8);
    margin-top: 4px;
    height: 16px;
  }
`;

const NUMPAD = [
  { d: "1", l: "" },
  { d: "2", l: "ABC" },
  { d: "3", l: "DEF" },
  { d: "4", l: "GHI" },
  { d: "5", l: "JKL" },
  { d: "6", l: "MNO" },
  { d: "7", l: "PQRS" },
  { d: "8", l: "TUV" },
  { d: "9", l: "WXYZ" },
  { d: "", l: "", empty: true },
  { d: "0", l: "+" },
  { d: "⌫", l: "", delete: true },
];

const APPS = [
  { icon: "📸", label: "Camera", color: "#1a1a2e" },
  { icon: "🗺️", label: "Maps", color: "#1e3a1e" },
  { icon: "🎵", label: "Music", color: "#2a1a2e" },
  { icon: "📧", label: "Mail", color: "#1a2535" },
  { icon: "💬", label: "Messages", color: "#1e3a1e" },
  { icon: "🌐", label: "Safari", color: "#1a1a3a" },
  { icon: "📅", label: "Calendar", color: "#3a1a1a" },
  { icon: "⚙️", label: "Settings", color: "#2a2a2a" },
  { icon: "📱", label: "Phone", color: "#1e3a1e" },
  { icon: "🎮", label: "Games", color: "#2a1535" },
  { icon: "📰", label: "News", color: "#2a1a1a" },
  { icon: "🔒", label: "Wallet", color: "#1a2a1e" },
];

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Stars() {
  const stars = useRef(
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      d: (Math.random() * 3 + 2).toFixed(1),
      delay: (Math.random() * 4).toFixed(1),
      minOp: (Math.random() * 0.15 + 0.05).toFixed(2),
      maxOp: (Math.random() * 0.5 + 0.3).toFixed(2),
    }))
  ).current;

  return (
    <div className="lock-stars">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            "--d": `${s.d}s`,
            "--delay": `-${s.delay}s`,
            "--min-op": s.minOp,
            "--max-op": s.maxOp,
          }}
        />
      ))}
    </div>
  );
}

export default function PhoneLockApp() {
  const [screen, setScreen] = useState("lock"); // lock | pin | home
  const [pin, setPin] = useState("");
  const [dotState, setDotState] = useState("idle"); // idle | error | success
  const [errorMsg, setErrorMsg] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [pressed, setPressed] = useState(null);
  const now = useClock();

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleNumPress = (digit) => {
    if (dotState !== "idle") return;
    if (digit === "⌫") {
      setPin((p) => p.slice(0, -1));
      setErrorMsg("");
      return;
    }
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        setDotState("success");
        setTimeout(() => {
          setScreen("home");
          setPin("");
          setDotState("idle");
        }, 500);
      } else {
        setDotState("error");
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setErrorMsg("Incorrect passcode");
        setTimeout(() => {
          setPin("");
          setDotState("idle");
          setErrorMsg("");
        }, 700);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (screen !== "pin") return;
    if (e.key >= "0" && e.key <= "9") handleNumPress(e.key);
    if (e.key === "Backspace") handleNumPress("⌫");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [screen, pin, dotState]);

  const lockAgain = () => {
    setScreen("lock");
    setPin("");
    setAttempts(0);
    setDotState("idle");
    setErrorMsg("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="phone-shell">
        <div className="phone">
          <div className="dynamic-island" />

          {/* LOCK SCREEN */}
          {screen === "lock" && (
            <div className="lock-screen">
              <Stars />
              <div className="lock-bg-glow" />

              <div className="lock-time-block">
                <div className="lock-time">{timeStr}</div>
                <div className="lock-date">{dateStr}</div>
              </div>

              <div className="lock-icon-wrap">
                <div
                  className="lock-icon"
                  onClick={() => setScreen("pin")}
                  title="Tap to unlock"
                >
                  🔒
                </div>
                <div className="lock-hint">Tap to enter passcode</div>
              </div>

              <div className="swipe-hint">
                <span>↑</span>
                <span>Swipe up to unlock</span>
              </div>
            </div>
          )}

          {/* PIN SCREEN */}
          {screen === "pin" && (
            <div className="pin-screen">
              <div className="pin-header">
                <div className="pin-title">Enter Passcode</div>
                <div className="pin-subtitle">Hint: 1234</div>
              </div>

              <div className="pin-dots">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`pin-dot ${
                      pin.length > i
                        ? dotState === "error"
                          ? "error"
                          : dotState === "success"
                          ? "success"
                          : "filled"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <div className="pin-error-msg">{errorMsg}</div>
              <div className="attempts-left">
                {attempts > 0 && attempts < 5
                  ? `${5 - attempts} attempt${5 - attempts !== 1 ? "s" : ""} remaining`
                  : ""}
              </div>

              <div className="numpad">
                {NUMPAD.map((btn, idx) =>
                  btn.empty ? (
                    <div key={idx} className="num-btn empty" />
                  ) : (
                    <button
                      key={idx}
                      className={`num-btn ${btn.delete ? "delete-btn" : ""} ${
                        pressed === idx ? "pressed" : ""
                      }`}
                      onPointerDown={() => {
                        setPressed(idx);
                        handleNumPress(btn.d);
                      }}
                      onPointerUp={() => setPressed(null)}
                      onPointerLeave={() => setPressed(null)}
                    >
                      {btn.delete ? (
                        <span className="digit">⌫</span>
                      ) : (
                        <>
                          <span className="digit">{btn.d}</span>
                          {btn.l && <span className="letters">{btn.l}</span>}
                        </>
                      )}
                    </button>
                  )
                )}
              </div>

              <button className="cancel-btn" onClick={() => setScreen("lock")}>
                Cancel
              </button>
            </div>
          )}

          {/* HOME SCREEN */}
          {screen === "home" && (
            <div className="home-screen">
              <div className="home-wallpaper-decor">
                <div
                  className="home-circle"
                  style={{
                    width: 400,
                    height: 400,
                    background: "radial-gradient(circle, #5040a0, transparent)",
                    top: -100,
                    right: -100,
                  }}
                />
                <div
                  className="home-circle"
                  style={{
                    width: 300,
                    height: 300,
                    background: "radial-gradient(circle, #2060a0, transparent)",
                    bottom: 100,
                    left: -80,
                  }}
                />
              </div>

              <div className="home-status-bar">
                <div className="home-time-small">{timeStr}</div>
                <div className="status-icons">
                  <span>▲▲▲</span>
                  <span>WiFi</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="home-greeting">
                <div className="home-greeting-label">Good {now.getHours() < 12 ? "morning" : now.getHours() < 17 ? "afternoon" : "evening"}</div>
                <div className="home-greeting-name">Welcome Back</div>
              </div>

              <div className="unlocked-badge">
                <span>🔓</span>
                <span>Phone Unlocked</span>
              </div>

              <div className="app-grid">
                {APPS.map((app, i) => (
                  <div className="app-icon" key={i}>
                    <div
                      className="app-icon-face"
                      style={{ background: app.color }}
                    >
                      {app.icon}
                    </div>
                    <span className="app-icon-label">{app.label}</span>
                  </div>
                ))}
              </div>

              <div className="lock-again-btn">
                <button className="lock-again-inner" onClick={lockAgain}>
                  🔒 Lock Phone
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
