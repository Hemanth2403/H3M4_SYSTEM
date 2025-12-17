import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, trend, trendUp, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Icon className="h-16 w-16" />
      </div>
      
      <div className="relative z-10">
        <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-mono font-bold text-foreground mb-2">{value}</h3>
        
        {trend && (
          <div className={`text-xs font-mono flex items-center gap-1 ${trendUp ? 'text-primary' : 'text-destructive'}`}>
            <span>{trendUp ? '▲' : '▼'}</span>
            {trend}
          </div>
        )}
      </div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[1px] w-full animate-scan" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }} />
    </motion.div>
  );
}