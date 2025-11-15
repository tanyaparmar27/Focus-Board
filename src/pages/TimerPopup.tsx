import { useState, useEffect } from "react";
import { Coffee, Droplets, Activity } from "lucide-react";

interface FloatingWindowState {
  isOpen: boolean;
  timeLeft: number;
  isRunning: boolean;
  mode: "focus" | "break" | "water";
}

const TimerPopup = () => {
  const [state, setState] = useState<FloatingWindowState>(() => {
    const stored = sessionStorage.getItem("timerPopupState");
    return stored
      ? JSON.parse(stored)
      : {
          isOpen: true,
          timeLeft: 45 * 60,
          isRunning: false,
          mode: "focus",
        };
  });

  const modes = {
    focus: { label: "Focus Time", icon: Activity, color: "#a855f7" },
    break: { label: "Break Time", icon: Coffee, color: "#00d4ff" },
    water: { label: "Water Break", icon: Droplets, color: "#06b6d4" },
  };

  const currentMode = modes[state.mode];
  const CurrentIcon = currentMode.icon;

  // Listen for updates from main window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "TIMER_UPDATE") {
        setState(event.data.state);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Also listen to sessionStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = sessionStorage.getItem("timerPopupState");
      if (stored) {
        setState(JSON.parse(stored));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        background: `linear-gradient(135deg, ${currentMode.color}20 0%, ${currentMode.color}10 100%)`,
        fontFamily: "'Outfit', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <CurrentIcon size={16} style={{ color: currentMode.color }} />
          {currentMode.label}
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${currentMode.color} 0%, ${currentMode.color}80 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(state.timeLeft)}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: state.isRunning ? "#10b981" : "#999",
            fontWeight: "500",
          }}
        >
          {state.isRunning ? "⏱️ Running" : "⏸️ Paused"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "8px",
          fontSize: "10px",
          color: "#999",
          textAlign: "center",
          width: "100%",
        }}
      >
        Return to main window to control
      </div>
    </div>
  );
};

export default TimerPopup;
