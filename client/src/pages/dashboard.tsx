import { ShieldAlert, Globe, Crosshair, Zap, ArrowRight, Filter, CheckCircle2, Bot, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { StatCard } from "@/components/stat-card";
import { ThreatCard } from "@/components/threat-card";
import { ThreatChart } from "@/components/threat-chart";
import { ReportModal } from "@/components/report-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Submission, CdocMetrics } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Security Overview</h1>
          <p className="text-muted-foreground">Live threat intelligence and system status.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            LIVE FEED ACTIVE
          </span>
          <ReportModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Global Threat Level"
          value="CRITICAL"
          icon={ShieldAlert}
          trend="+12% vs last week"
          trendUp={false} // false because increasing threat is bad
          delay={0}
        />
        <StatCard
          label="Verified Submissions"
          value="1,284"
          icon={Crosshair}
          trend="+5% vs last week"
          trendUp={true}
          delay={0.1}
        />
        <StatCard
          label="Active Researchers"
          value="452"
          icon={Globe}
          trend="+8 new today"
          trendUp={true}
          delay={0.2}
        />
        <StatCard
          label="Avg. Mitigation Time"
          value="4h 12m"
          icon={Zap}
          trend="-30m improvement"
          trendUp={true}
          delay={0.3}
        />
      </div>

      {/* Intelligence-Guided Risk Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Forecasted Attack Surfaces
              </h3>
              <p className="text-xs text-muted-foreground">High-confidence vulnerable zones based on threat signals.</p>
            </div>
            <Badge variant="outline" className="animate-pulse border-primary text-primary">LIVE SIGNALS</Badge>
          </div>

          <div className="space-y-4">
            {[
              { label: "FinTech: OAuth 2.0 Flow Integrities", impact: "High", signal: "Surge in pattern-based bypass attempts observed in darknet telemetry.", trend: "Upward" },
              { label: "SaaS: Cross-Tenant Logic Flaws", impact: "Critical", signal: "New exploit chain identified in popular multi-tenant frameworks.", trend: "Stable" },
            ].map((zone, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/20 border border-white/5 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold">{zone.label}</span>
                    <Badge className={zone.impact === 'Critical' ? 'bg-destructive/20 text-destructive border-destructive/20' : 'bg-orange-500/20 text-orange-500 border-orange-500/20'} variant="outline">
                      {zone.impact}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">"{zone.signal}"</p>
                </div>
                <div className="flex flex-col justify-center items-end min-w-[120px]">
                  <Link href="/missions">
                    <Button variant="ghost" size="sm" className="text-[10px] h-7 gap-1 font-bold group">
                      START MISSION <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Bot className="h-20 w-20 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4" /> AI Predictive Forecast
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-primary italic">ANOMALY_RISK: HIGH</span>
                  <span className="text-[10px] text-muted-foreground font-mono">T+4h</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Neural patterns suggest a 84% probability of a distributed egress sweep on Shard #882 within the next 4 hours.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground italic">MITIGATION_SUCCESS</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Verified</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Patch #SG-992-ALPHA has successfully neutralized 100% of the identified OAuth bypass signatures.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <Link href="/cdoc">
              <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5 h-8">
                Access Wardens Command
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold">Threat Activity Heatmap</h3>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-white/5 rounded text-muted-foreground hover:text-foreground transition-colors"><Filter className="h-4 w-4" /></button>
            </div>
          </div>
          <ThreatChart />
        </div>

        {/* Recent Alerts Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-heading font-semibold">Priority Intel</h3>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            <ThreatCard
              title="AWS IAM Privilege Escalation via Misconfigured Role"
              severity="critical"
              type="Cloud Security"
              score={98}
              date="2h ago"
              author="zero_cool"
            />
            <ThreatCard
              title="SaaS API Logic Flaw allowing Tenant Crossover"
              severity="high"
              type="API Security"
              score={85}
              date="5h ago"
              author="neo_matrix"
            />
            <ThreatCard
              title="Potential Supply Chain Risk in npm package"
              severity="medium"
              type="Supply Chain"
              score={62}
              date="12h ago"
              author="trinity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}