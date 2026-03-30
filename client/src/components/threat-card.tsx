import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  AlertTriangle,
  ShieldCheck,
  Lock,
  Activity,
  ChevronRight,
  Zap,
  Target,
  Info,
  FileText,
  ShieldAlert,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThreatCardProps {
  id?: number | string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  score: number;
  date: string;
  author: string;
  authorTier?: string;
  description?: string;
  impact?: string;
  mitigation?: string;
}

export function ThreatCard({
  title,
  severity,
  type,
  score,
  date,
  author,
  authorTier = "ACTIVE",
  description = "Detailed intelligence profile pending decryption. Initial assessment indicates a potential bypass vector in the middleware authentication layer.",
  impact = "High: Compromise of user sessions and potential administrative takeover.",
  mitigation = "1. Update core framework to v4.2.0. 2. Implement strict Content Security Policy (CSP). 3. Audit all JWT signature verification logic."
}: ThreatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleTechnicalCase = () => {
    setIsOpen(false);
    setLocation("/technical-case");
  };

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

  const handleViewIntel = () => {
    setIsOpen(true);
    toast.info("Accessing Encrypted Vault...", {
      description: `Decrypting intelligence for ${title}`,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(38,217,98,0.05)] flex flex-col h-full"
      >
        <div className="flex justify-between items-start mb-3">
          <div className={cn("px-2 py-1 rounded text-[10px] font-mono uppercase border", severityColor[severity])}>
            {severity}
          </div>
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-muted-foreground">SCORE:</span>
            <span className={cn("font-bold", scoreColor(score))}>{score}</span>
          </div>
        </div>

        <h3 className="font-heading font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>

        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4">
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
              {author.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground leading-none mb-0.5">by {author}</span>
              <span className={cn(
                "text-[7px] font-bold px-1 rounded-sm w-fit",
                authorTier === "ELITE" ? "bg-primary/20 text-primary" :
                  authorTier === "ZERO-DAY-EXPERT" ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-muted-foreground"
              )}>
                {authorTier}
              </span>
            </div>
          </div>
          <button
            onClick={handleViewIntel}
            className="text-[10px] font-mono text-primary hover:underline decoration-primary/50 underline-offset-4 flex items-center gap-1 group/btn"
          >
            VIEW INTEL <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Intel Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-sidebar/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-orange-500 to-destructive" />

          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={cn("uppercase text-[10px] font-mono", severityColor[severity])}>
                  {severity} SEVERITY
                </Badge>
                <span className="text-[10px] font-mono text-muted-foreground tracking-widest">THREAT_INTEL_ID: #882-X9</span>
              </div>
              <DialogTitle className="text-2xl font-heading font-bold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-primary/80 font-mono mt-1">
                Verified by H3M4 Governance Node | Published {date} by {author}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Risk Score</div>
                <div className={cn("text-xl font-bold font-mono", scoreColor(score))}>{score}</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Confidence</div>
                <div className="text-xl font-bold font-mono text-emerald-500">94%</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Impact</div>
                <div className="text-xl font-bold font-mono text-orange-500">CRITICAL</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Sector</div>
                <div className="text-sm font-bold truncate mt-1">FINTECH</div>
              </div>
            </div>

            <Tabs defaultValue="intel" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0 mb-6">
                <TabsTrigger value="intel" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Deep Intelligence</TabsTrigger>
                <TabsTrigger value="mitigation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Actionable Mitigation</TabsTrigger>
                <TabsTrigger value="technical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Technical Flow</TabsTrigger>
              </TabsList>

              <TabsContent value="intel" className="space-y-4">
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 h-fit">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">Threat Overview</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                  <div className="p-2 rounded-lg bg-destructive/10 h-fit">
                    <ShieldAlert className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-destructive uppercase tracking-wider">Business Impact Assessment</h4>
                    <p className="text-sm text-foreground/90">{impact}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mitigation" className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <h4 className="text-sm font-bold text-emerald-500 mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Recommended Defense Strategy
                  </h4>
                  <div className="space-y-3">
                    {mitigation.split('. ').map((step, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-emerald-500 font-mono font-bold shrink-0">{i + 1}.</span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-xs text-primary/80 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                    <FileText className="h-3 w-3" /> STRAWMAN_EXPLOIT_FLOW.LOG
                  </div>
                  <div className="text-foreground/70">1. Attacker initiates profiling via <span className="text-orange-400">/api/v1/auth/session</span></div>
                  <div className="text-foreground/70">2. Injection of malicious payload in <span className="text-orange-400">X-Forwarded-For</span> header</div>
                  <div className="text-foreground/70">3. Middleware fails to sanitize input, leading to <span className="text-destructive font-bold">UNAUTHORIZED_ACCESS</span></div>
                  <div className="text-foreground/70">4. Exfiltration of ephemeral tokens observed in 12% of simulations</div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Target className="h-3 w-3" />
                <span className="uppercase tracking-widest">Status: Monitoring Active</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setIsOpen(false)}>
                  Dismiss
                </Button>
                <Button
                  onClick={handleTechnicalCase}
                  size="sm"
                  className="bg-primary text-black font-bold text-xs h-8 gap-2"
                >
                  <ExternalLink className="h-3 w-3" /> Full Technical Case
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}