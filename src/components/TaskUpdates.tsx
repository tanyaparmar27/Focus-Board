import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser, getUserUpdates, saveUpdates } from "@/contexts/UserContext";

export const TaskUpdates = () => {
  const { user } = useUser();

  const [updates, setUpdates] = useState(() => {
    if (!user) return "";
    return getUserUpdates(user.name);
  });
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Persist updates to localStorage with debounce and visual feedback
  useEffect(() => {
    if (!user) return;
    
    setIsSaving(true);
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 500ms
    saveTimeoutRef.current = setTimeout(() => {
      try {
        saveUpdates(user.name, updates);
        setIsSaving(false);
      } catch (e) {
        console.error("Failed to save updates to localStorage:", e);
        setIsSaving(false);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [updates, user]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(updates);
      setCopied(true);
      toast({
        title: "Copied! ✨",
        description: "Updates ready to be shared.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getSampleUpdate = () => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    return `Daily Update - ${today}\n\nCompleted:\n• \n\nIn Progress:\n• \n\nNext Steps:\n• \n\nBlockers:\n• None`;
  };

  const handleUseSample = () => {
    setUpdates(getSampleUpdate());
  };

  return (
    <div className="glass-effect p-6 rounded-3xl shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Task Updates</h3>
          {isSaving && (
            <div className="flex items-center gap-1.5 ml-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Saving...</span>
            </div>
          )}
        </div>
        <Button
          onClick={handleUseSample}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          Use Template
        </Button>
      </div>

      <Textarea
        value={updates}
        onChange={(e) => setUpdates(e.target.value)}
        placeholder="Write your daily updates here... What did you accomplish today?"
        className="min-h-[200px] glass-effect border-border/50 focus-visible:ring-primary resize-none"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          disabled={!updates.trim()}
          className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow"
        >
          {copied ? (
            <>
              <CheckCheck className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Perfect for standup meetings and progress reports 📊
      </p>
    </div>
  );
};
