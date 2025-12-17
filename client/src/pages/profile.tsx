import { Shield, Award, DollarSign, Target, Calendar, Briefcase } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { ThreatCard } from "@/components/threat-card";

export default function Profile() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative glass-panel rounded-xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-50">
          <Shield className="h-32 w-32 text-primary/10" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-2xl font-bold font-mono text-white">
              JS
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-heading font-bold">John Smith (cipher_01)</h1>
              <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1">
                <Shield className="h-3 w-3" /> VERIFIED
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-xl">
              Elite security researcher specializing in Cloud Infrastructure and Kubernetes security.
              Top contributor to H3M4 since 2024.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-mono">
              <div className="flex items-center gap-2 text-foreground/80 bg-white/5 px-3 py-1 rounded-full">
                <Award className="h-4 w-4 text-yellow-500" />
                <span>Rank: #42 Global</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80 bg-white/5 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Joined: Jan 2024</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80 bg-white/5 px-3 py-1 rounded-full">
                <Briefcase className="h-4 w-4 text-purple-500" />
                <span>Enterprise Usage: 142 Orgs</span>
              </div>
            </div>
          </div>

          <div className="text-right hidden md:block">
            <div className="text-sm text-muted-foreground mb-1">Reputation Score</div>
            <div className="text-4xl font-mono font-bold text-primary text-glow">985</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Earnings" 
          value="$12,450" 
          icon={DollarSign} 
          trend="+$2,100 this month"
          trendUp={true}
          delay={0.1}
        />
        <StatCard 
          label="Valid Submissions" 
          value="24" 
          icon={Target} 
          trend="92% acceptance rate"
          trendUp={true}
          delay={0.2}
        />
        <StatCard 
          label="Impact Score" 
          value="Top 5%" 
          icon={Award} 
          trend="Elite Tier"
          trendUp={true}
          delay={0.3}
        />
      </div>

      {/* Recent Submissions */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading font-bold">Recent Contributions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ThreatCard 
            title="SaaS API Logic Flaw allowing Tenant Crossover"
            severity="high"
            type="API Security"
            score={85}
            date="5h ago"
            author="cipher_01"
          />
          <ThreatCard 
            title="IDOR vulnerability in Fintech Payment Gateway"
            severity="high"
            type="Web Application"
            score={88}
            date="1d ago"
            author="cipher_01"
          />
        </div>
      </div>
    </div>
  );
}