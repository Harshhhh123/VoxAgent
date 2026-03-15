import { useState, useRef, useEffect } from "react";

const styles = {
  "@import": "url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700&display=swap')",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700&display=swap');

  .vox-shell * { box-sizing: border-box; margin: 0; padding: 0; }

  .vox-shell {
    min-height: 100vh;
    background: #f5f4f0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 32px 16px 48px;
    font-family: 'Syne', sans-serif;
  }

  .vox-inner {
    width: 100%;
    max-width: 420px;
  }

  /* Header */
  .vox-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .vox-logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vox-logo-mark {
    width: 28px; height: 28px;
    background: #1a1a2e;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }

  .vox-logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #0d0d0f;
    letter-spacing: -0.4px;
  }

  .vox-status {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .vox-status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    transition: background 0.3s;
  }

  .vox-status-label {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #9898a8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* Mic Card */
  .vox-mic-card {
    background: #ffffff;
    border: 0.5px solid rgba(0,0,0,0.14);
    border-radius: 20px;
    padding: 36px 28px 28px;
    margin-bottom: 16px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .vox-mic-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(91,94,244,0.06) 0%, transparent 65%);
    pointer-events: none;
  }

  .vox-card-label {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #9898a8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 24px;
  }

  .vox-mic-btn {
    width: 88px; height: 88px;
    border-radius: 50%;
    background: #1a1a2e;
    border: none;
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: transform 0.12s, opacity 0.12s;
    position: relative;
    z-index: 1;
  }

  .vox-mic-btn:hover { transform: scale(1.05); }
  .vox-mic-btn:active { transform: scale(0.96); }

  .vox-mic-btn.listening {
    background: #5b5ef4;
    animation: vox-pulse-ring 1.4s ease-out infinite;
  }

  /* Waveform */
  .vox-waveform {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 40px;
    margin-top: 20px;
  }

  .vox-bar {
    width: 3px;
    border-radius: 99px;
    background: #5b5ef4;
    transform-origin: center bottom;
    transition: background 0.3s, transform 0.3s;
  }

  .vox-bar.idle {
    background: rgba(0,0,0,0.1);
    transform: scaleY(0.25);
  }

  .vox-bar.active:nth-child(1) { height: 22px; animation: vox-bar1 0.8s ease-in-out infinite; }
  .vox-bar.active:nth-child(2) { height: 32px; animation: vox-bar2 0.7s ease-in-out infinite 0.1s; }
  .vox-bar.active:nth-child(3) { height: 28px; animation: vox-bar3 0.9s ease-in-out infinite 0.2s; }
  .vox-bar.active:nth-child(4) { height: 36px; animation: vox-bar4 0.75s ease-in-out infinite 0.05s; }
  .vox-bar.active:nth-child(5) { height: 24px; animation: vox-bar5 0.85s ease-in-out infinite 0.15s; }
  .vox-bar.active:nth-child(6) { height: 34px; animation: vox-bar6 0.7s ease-in-out infinite 0.08s; }
  .vox-bar.active:nth-child(7) { height: 20px; animation: vox-bar7 0.8s ease-in-out infinite 0.22s; }

  .vox-state-text {
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    color: #9898a8;
    margin-top: 10px;
    min-height: 18px;
    letter-spacing: 0.04em;
  }

  /* Transcripts */
  .vox-transcripts {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .vox-bubble {
    background: #ffffff;
    border: 0.5px solid rgba(0,0,0,0.08);
    border-radius: 16px;
    padding: 14px 18px;
    animation: vox-fadein 0.25s ease;
  }

  .vox-bubble-label {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }

  .vox-bubble-label.you { color: #9898a8; }
  .vox-bubble-label.ai  { color: #5b5ef4; }

  .vox-bubble-label .vox-icon {
    width: 16px; height: 16px;
    border-radius: 4px;
    display: inline-flex; align-items: center; justify-content: center;
  }

  .vox-bubble-label.you .vox-icon { background: #f5f4f0; }
  .vox-bubble-label.ai  .vox-icon { background: rgba(91,94,244,0.12); }

  .vox-bubble-text {
    font-size: 14px;
    color: #0d0d0f;
    line-height: 1.6;
    font-family: 'Syne', sans-serif;
    font-weight: 400;
  }

  .vox-bubble-text.empty {
    color: #9898a8;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
  }

  /* Thinking dots */
  .vox-thinking {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }

  .vox-thinking span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #5b5ef4;
    animation: vox-bar1 0.6s ease-in-out infinite;
  }

  .vox-thinking span:nth-child(2) { animation-delay: 0.15s; }
  .vox-thinking span:nth-child(3) { animation-delay: 0.3s; }

  /* Bottom bar */
  .vox-bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 0.5px solid rgba(0,0,0,0.08);
  }

  .vox-bottom-meta {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #9898a8;
  }

  .vox-clear-btn {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #9898a8;
    background: none;
    border: 0.5px solid rgba(0,0,0,0.14);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    letter-spacing: 0.05em;
  }

  .vox-clear-btn:hover { color: #0d0d0f; border-color: #9898a8; }

  /* Keyframes */
  @keyframes vox-pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(91,94,244,0.4); }
    70%  { box-shadow: 0 0 0 18px rgba(91,94,244,0); }
    100% { box-shadow: 0 0 0 0 rgba(91,94,244,0); }
  }

  @keyframes vox-fadein {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: none; }
  }

  @keyframes vox-bar1 { 0%,100%{transform:scaleY(.35)} 50%{transform:scaleY(1)} }
  @keyframes vox-bar2 { 0%,100%{transform:scaleY(.6)}  50%{transform:scaleY(.2)} }
  @keyframes vox-bar3 { 0%,100%{transform:scaleY(.2)}  50%{transform:scaleY(.9)} }
  @keyframes vox-bar4 { 0%,100%{transform:scaleY(.8)}  50%{transform:scaleY(.3)} }
  @keyframes vox-bar5 { 0%,100%{transform:scaleY(.4)}  50%{transform:scaleY(1)} }
  @keyframes vox-bar6 { 0%,100%{transform:scaleY(.9)}  50%{transform:scaleY(.2)} }
  @keyframes vox-bar7 { 0%,100%{transform:scaleY(.3)}  50%{transform:scaleY(.7)} }
`;

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [turns, setTurns] = useState(0);
  const [statusLabel, setStatusLabel] = useState("Ready");
  const [statusColor, setStatusColor] = useState("#22c55e");
  const [stateText, setStateText] = useState("—");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const finalTranscriptRef = useRef("");
  const manualStopRef = useRef(false);

  const sendTranscript = async (transcript) => {
    if (!transcript.trim()) return;
    setThinking(true);
    setStatusLabel("Thinking");
    setStatusColor("#a78bfa");
    setStateText("Processing…");

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript }),
      });
      const data = await response.json();
      setAiText(data.response);
      speak(data.response);
      setTurns((t) => t + 1);
    } catch {
      setAiText("Could not reach the server.");
    }

    setThinking(false);
    setStatusLabel("Ready");
    setStatusColor("#22c55e");
    setStateText("—");
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;        // keep listening through pauses
    rec.interimResults = true;    // show live partial transcript

    rec.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        finalTranscriptRef.current += " " + final;
      }

      // Show live text: confirmed final + current interim
      setUserText((finalTranscriptRef.current + " " + interim).trim());
    };

    rec.onerror = (e) => {
      // "no-speech" is not a real error — just silence, ignore it
      if (e.error === "no-speech") return;
      setListening(false);
      setStatusLabel("Ready");
      setStatusColor("#22c55e");
      setStateText("Error — try again");
    };

    rec.onend = () => {
      // If user clicked Stop, submit what was captured
      if (manualStopRef.current) {
        manualStopRef.current = false;
        setListening(false);
        const captured = finalTranscriptRef.current.trim();
        if (captured) {
          sendTranscript(captured);
        } else {
          setStatusLabel("Ready");
          setStatusColor("#22c55e");
          setStateText("Nothing captured — try again");
        }
      }
    };

    recognitionRef.current = rec;
  }, []);

  const toggleListen = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      manualStopRef.current = true;
      rec.stop();
      setStateText("Processing…");
    } else {
      finalTranscriptRef.current = "";
      setUserText("");
      setAiText("");
      setListening(true);
      setStatusLabel("Listening");
      setStatusColor("#f97316");
      setStateText("Speak now — press Stop when done");
      rec.start();
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speechSynthesis.speak(speech);
  };

  const clearSession = () => {
    setUserText("");
    setAiText("");
    setTurns(0);
    setStateText("—");
  };

  const barClass = listening ? "vox-bar active" : "vox-bar idle";

  return (
    <div className="vox-shell">
      <div className="vox-inner">

        {/* Header */}
        <div className="vox-header">
          <div className="vox-logo">
            <div className="vox-logo-mark">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 7v3M5.5 10h3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="vox-logo-text">VoxAgent</span>
          </div>
          <div className="vox-status">
            <span className="vox-status-dot" style={{ background: statusColor }} />
            <span className="vox-status-label">{statusLabel}</span>
          </div>
        </div>

        {/* Mic Card */}
        <div className="vox-mic-card">
          <div className="vox-card-label">
            {listening ? "Press Stop when done" : "Press to speak"}
          </div>

          <button
            className={`vox-mic-btn${listening ? " listening" : ""}`}
            onClick={toggleListen}
          >
          {listening ? (
            // Stop square icon
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="7" y="7" width="14" height="14" rx="3" fill="white"/>
            </svg>
          ) : (
            // Mic icon
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect x="10" y="3" width="10" height="16" rx="5" fill="white"/>
              <path d="M5 14c0 5.52 4.48 10 10 10s10-4.48 10-10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="15" y1="24" x2="15" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          </button>

          <div className="vox-waveform">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={barClass} />
            ))}
          </div>

          <div className="vox-state-text">{stateText}</div>
        </div>

        {/* Transcripts */}
        <div className="vox-transcripts">
          <div className="vox-bubble">
            <div className="vox-bubble-label you">
              <span className="vox-icon">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="3.5" r="2" fill="currentColor" opacity=".5"/>
                  <path d="M1 9c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".5"/>
                </svg>
              </span>
              You
            </div>
            <div className={`vox-bubble-text${userText ? "" : " empty"}`}>
              {userText || "Waiting for input…"}
            </div>
          </div>

          <div className="vox-bubble">
            <div className="vox-bubble-label ai">
              <span className="vox-icon">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="#5b5ef4" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M5 5v2M4 7h2" stroke="#5b5ef4" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              VoxAgent
            </div>
            <div className={`vox-bubble-text${aiText || thinking ? "" : " empty"}`}>
              {thinking ? (
                <span className="vox-thinking">
                  <span /><span /><span />
                </span>
              ) : (
                aiText || "Response will appear here…"
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="vox-bottom-bar">
          <span className="vox-bottom-meta">
            {turns} {turns === 1 ? "turn" : "turns"}
          </span>
          <button className="vox-clear-btn" onClick={clearSession}>
            Clear session
          </button>
        </div>

      </div>
    </div>
  );
}