import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Droplets, Activity, Bell, BellOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type TimerMode = "focus" | "break" | "water";

export const FocusTimer = () => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastWaterReminder, setLastWaterReminder] = useState(0);
  const intervalRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  }, []);

  // Initialize notification sound
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const createBeep = () => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    };
    
    audioRef.current = { play: createBeep } as any;
  }, []);

  const modes = {
    focus: { duration: 25 * 60, label: "Focus Time", icon: Activity, color: "text-primary" },
    break: { duration: 5 * 60, label: "Break Time", icon: Coffee, color: "text-accent" },
    water: { duration: 2 * 60, label: "Water Break", icon: Droplets, color: "text-secondary" },
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Send reminders during focus mode
          if (mode === "focus") {
            const minutesElapsed = (initialTime - newTime) / 60;
            
            // Water reminder every 20 minutes
            if (minutesElapsed > 0 && minutesElapsed % 20 === 0 && minutesElapsed !== lastWaterReminder) {
              setLastWaterReminder(minutesElapsed);
              sendNotification(
                "💧 Hydration Time!",
                "Don't forget to drink some water! Stay hydrated.",
                "water"
              );
            }
            
            // Stretch reminder at 15 minutes
            if (newTime === 10 * 60) {
              sendNotification(
                "🧘‍♀️ Stretch Break!",
                "Quick reminder to stretch and relax your eyes for a moment.",
                "stretch"
              );
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, initialTime, lastWaterReminder]);

  const sendNotification = (title: string, body: string, tag: string = "timer") => {
    // Play sound
    if (audioRef.current) {
      try {
        audioRef.current.play();
      } catch (e) {
        console.log("Could not play sound:", e);
      }
    }

    // Show toast
    toast({ title, description: body });

    // Send browser notification if enabled
    if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        tag,
        requireInteraction: false,
      });
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === "focus") {
      sendNotification(
        "🎉 Focus Session Complete!",
        "Great work! Time for a break. Don't forget to stretch and hydrate.",
        "focus-complete"
      );
    } else if (mode === "water") {
      sendNotification(
        "💧 Hydration Complete!",
        "Back to being productive!",
        "water-complete"
      );
    } else {
      sendNotification(
        "☕ Break's Over!",
        "Ready to focus again?",
        "break-complete"
      );
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      
      if (permission === "granted") {
        toast({
          title: "Notifications Enabled! 🔔",
          description: "You'll get reminders even when working in other tabs.",
        });
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Enable them in your browser settings to get reminders.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setLastWaterReminder(0);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setLastWaterReminder(0);
    const duration = modes[newMode].duration;
    setTimeLeft(duration);
    setInitialTime(duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const CurrentIcon = modes[mode].icon;

  return (
    <div className="glass-effect p-6 rounded-3xl shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CurrentIcon className={`h-5 w-5 ${modes[mode].color}`} />
          <h3 className="font-semibold text-lg">{modes[mode].label}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={requestNotificationPermission}
            className={notificationsEnabled ? "text-primary" : "text-muted-foreground"}
            title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
          >
            {notificationsEnabled ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>
          {(Object.keys(modes) as TimerMode[]).map((m) => {
            const Icon = modes[m].icon;
            return (
              <Button
                key={m}
                variant={mode === m ? "default" : "ghost"}
                size="sm"
                onClick={() => switchMode(m)}
                className={mode === m ? "bg-gradient-primary" : ""}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {formatTime(timeLeft)}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 shadow-glow flex-1"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={resetTimer}
          size="lg"
          variant="secondary"
          className="glass-effect"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {mode === "focus" && !notificationsEnabled && (
        <button
          onClick={requestNotificationPermission}
          className="w-full p-3 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all text-xs text-center"
        >
          <Bell className="h-3 w-3 inline mr-2" />
          Enable notifications to get reminders in other tabs
        </button>
      )}
      
      {mode === "focus" && notificationsEnabled && (
        <p className="text-xs text-center text-muted-foreground">
          You'll get reminders to drink water (every 20 min) and stretch! 💝
        </p>
      )}
    </div>
  );
};
