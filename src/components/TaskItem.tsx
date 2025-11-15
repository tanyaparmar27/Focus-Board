import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  expiresIn: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ id, text, completed, expiresIn, onToggle, onDelete }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(id), 300);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-2xl glass-effect task-hover",
        isDeleting && "opacity-0 scale-95",
        "transition-all duration-300"
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <div className="flex-1">
        <span
          className={cn(
            "block transition-all duration-300",
            completed && "line-through text-muted-foreground opacity-60"
          )}
        >
          {text}
        </span>
      </div>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
