import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface ProgressCardProps {
  completedTasks: number;
  totalTasks: number;
}

export const ProgressCard = ({ completedTasks, totalTasks }: ProgressCardProps) => {
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="glass-effect p-6 rounded-3xl shadow-soft space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <h3 className="font-semibold text-lg">Today's Progress</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Completed</span>
          <span className="font-semibold">
            {completedTasks} of {totalTasks}
          </span>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>
      {percentage === 100 && totalTasks > 0 && (
        <p className="text-sm text-primary font-medium animate-fade-in">
          🎉 Amazing work! You completed all your tasks!
        </p>
      )}
    </div>
  );
};
