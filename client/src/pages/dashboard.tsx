import { ShieldAlert, Globe, Crosshair, Zap, ArrowRight, Filter } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { ThreatCard } from "@/components/threat-card";
import { ThreatChart } from "@/components/threat-chart";

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
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
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