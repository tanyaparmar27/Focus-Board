import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddTaskInputProps {
  onAdd: (text: string) => void;
}

export const AddTaskInput = ({ onAdd }: AddTaskInputProps) => {
  const [taskText, setTaskText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAdd(taskText.trim());
      setTaskText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 glass-effect border-border/50 focus-visible:ring-primary"
      />
      <Button
        type="submit"
        size="icon"
        className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </form>
  );
};
