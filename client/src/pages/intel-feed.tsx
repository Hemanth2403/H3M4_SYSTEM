import { useState } from "react";
import { Search, Filter, ChevronDown, Download } from "lucide-react";
import { ThreatCard } from "@/components/threat-card";

export default function IntelFeed() {
  const [filter, setFilter] = useState("all");

  const threats = [
    {
      id: 5,
      title: "Stored XSS in User Profile via SVG Upload",
      severity: "critical",
      type: "Web Application",
      score: 92,
      date: "10m ago",
      author: "ghost_shell"
    },
    {
      id: 1,
      title: "AWS IAM Privilege Escalation via Misconfigured Role",
      severity: "critical",
      type: "Cloud Security",
      score: 98,
      date: "2h ago",
      author: "zero_cool"
    },
    {
      id: 2,
      title: "SaaS API Logic Flaw allowing Tenant Crossover",
      severity: "high",
      type: "API Security",
      score: 85,
      date: "5h ago",
      author: "neo_matrix"
    },
    {
      id: 3,
      title: "Potential Supply Chain Risk in npm package",
      severity: "medium",
      type: "Supply Chain",
      score: 62,
      date: "12h ago",
      author: "trinity"
    },
    {
      id: 4,
      title: "Zero-day in popular Kubernetes Ingress Controller",
      severity: "critical",
      type: "Infrastructure",
      score: 95,
      date: "1d ago",
      author: "morpheus"
    },
    {
      id: 5,
      title: "IDOR vulnerability in Fintech Payment Gateway",
      severity: "high",
      type: "Web Application",
      score: 88,
      date: "1d ago",
      author: "cipher"
    },
    {
      id: 6,
      title: "Sensitive data exposure in public git repo",
      severity: "medium",
      type: "OSINT",
      score: 55,
      date: "2d ago",
      author: "ghost"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Intel Feed</h1>
          <p className="text-muted-foreground">Verified vulnerabilities and emerging threat patterns.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold text-sm hover:bg-primary/90 transition-colors">
          <Download className="h-4 w-4" />
          Export Audit Report
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-card/40 border border-border backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search vulnerabilities, CVEs, or authors..." 
            className="w-full bg-background/50 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-background/50 border border-white/10 rounded-md text-sm hover:bg-white/5 transition-colors">
            <Filter className="h-4 w-4" />
            Industry
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-background/50 border border-white/10 rounded-md text-sm hover:bg-white/5 transition-colors">
            <Filter className="h-4 w-4" />
            Severity
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-background/50 border border-white/10 rounded-md text-sm hover:bg-white/5 transition-colors">
            <Filter className="h-4 w-4" />
            Category
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {threats.map((threat) => (
          // @ts-ignore
          <ThreatCard key={threat.id} {...threat} />
        ))}
      </div>
    </div>
  );
}