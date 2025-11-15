import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TaskItem } from "@/components/TaskItem";
import { AddTaskInput } from "@/components/AddTaskInput";
import { ProgressCard } from "@/components/ProgressCard";
import { DailyGoals } from "@/components/DailyGoals";
import { FocusTimer } from "@/components/FocusTimer";
import { TaskUpdates } from "@/components/TaskUpdates";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser, getUserTasks, saveTasks } from "@/contexts/UserContext";
import { Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (!user) return [];
    return getUserTasks(user.name);
  });

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      saveTasks(user.name, tasks);
    }
  }, [tasks, user]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Auto-delete tasks after 7 days
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      setTasks((prevTasks) =>
        prevTasks.filter((task) => now - task.createdAt < sevenDays)
      );
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour >=12 && currentHour < 16
      ? "Good afternoon"
      : "Good evening";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-soft p-4 md:p-8">
      <div className="flex justify-between items-center">
        <ThemeToggle />
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <header className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect shadow-soft">
            <Heart className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Productivity Space</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {greeting}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Let's make today amazing ✨
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <ProgressCard completedTasks={completedTasks} totalTasks={tasks.length} />
          <DailyGoals />
        </div>

        {/* Focus Timer */}
        <FocusTimer />

        {/* Tasks Section */}
        <div className="glass-effect p-6 md:p-8 rounded-3xl shadow-soft space-y-6">
          <h2 className="text-2xl font-semibold">Today's Tasks</h2>
          <AddTaskInput onAdd={addTask} />
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tasks yet. Add one to get started! 🎯
              </p>
            ) : (
              tasks.map((task) => {
                const expiresIn = 7 * 24 * 60 * 60 * 1000 - (Date.now() - task.createdAt);
                return (
                  <TaskItem
                    key={task.id}
                    {...task}
                    expiresIn={expiresIn}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Task Updates Section */}
        <TaskUpdates />
      </div>
    </div>
  );
};

export default Index;
