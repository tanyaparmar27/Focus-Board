import { useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { AddTaskInput } from "@/components/AddTaskInput";
import { ProgressCard } from "@/components/ProgressCard";
import { DailyGoals } from "@/components/DailyGoals";
import { FocusTimer } from "@/components/FocusTimer";
import { TaskUpdates } from "@/components/TaskUpdates";
import ThemeToggle from "@/components/ThemeToggle";
import { Heart } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
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

  const completedTasks = tasks.filter((task) => task.completed).length;

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="min-h-screen bg-gradient-soft p-4 md:p-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <header className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect shadow-soft">
            <Heart className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Productivity Space</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {greeting}, Tanya!
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
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
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
