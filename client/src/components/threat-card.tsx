import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Lock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreatCardProps {
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  score: number;
  date: string;
  author: string;
}

export function ThreatCard({ title, severity, type, score, date, author }: ThreatCardProps) {
  const severityColor = {
    critical: "text-destructive border-destructive/30 bg-destructive/5",
    high: "text-orange-500 border-orange-500/30 bg-orange-500/5",
    medium: "text-yellow-500 border-yellow-500/30 bg-yellow-500/5",
    low: "text-blue-500 border-blue-500/30 bg-blue-500/5",
  };

  const scoreColor = (s: number) => {
    if (s >= 90) return "text-destructive";
    if (s >= 70) return "text-orange-500";
    if (s >= 50) return "text-yellow-500";
    return "text-blue-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(38,217,98,0.05)]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={cn("px-2 py-1 rounded text-xs font-mono uppercase border", severityColor[severity])}>
          {severity}
        </div>
        <div className="flex items-center gap-1 font-mono text-sm">
          <span className="text-muted-foreground">SCORE:</span>
          <span className={cn("font-bold", scoreColor(score))}>{score}</span>
        </div>
      </div>

      <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3" /> {type}
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" /> {date}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-auto">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold">
            {author.substring(0,2).toUpperCase()}
          </div>
          <span className="text-xs text-muted-foreground">by {author}</span>
        </div>
        <button className="text-xs font-mono text-primary hover:underline decoration-primary/50 underline-offset-4">
          VIEW INTEL &rarr;
        </button>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}