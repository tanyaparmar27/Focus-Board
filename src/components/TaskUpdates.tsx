import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const TaskUpdates = () => {
  const [updates, setUpdates] = useState("");
  const [copied, setCopied] = useState(false);

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
