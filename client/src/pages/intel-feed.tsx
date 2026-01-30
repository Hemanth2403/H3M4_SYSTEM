import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, Check, X, Zap } from "lucide-react";
import { ThreatCard } from "@/components/threat-card";
import { ReportModal } from "@/components/report-modal";
import { DisclosureModal } from "@/components/disclosure-modal";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ALL_THREATS = [
  {
    id: "T-001",
    title: "Stored XSS in User Profile via SVG Upload",
    severity: "critical",
    type: "Web Application",
    score: 92,
    date: "10m ago",
    author: "ghost_shell",
    industry: "SaaS",
    feasibility: "Confirmed"
  },
  {
    id: "T-002",
    title: "AWS IAM Privilege Escalation via Misconfigured Role",
    severity: "critical",
    type: "Cloud Security",
    score: 98,
    date: "2h ago",
    author: "zero_cool",
    industry: "GovTech",
    feasibility: "Confirmed"
  },
  {
    id: "T-003",
    title: "SaaS API Logic Flaw allowing Tenant Crossover",
    severity: "high",
    type: "API Security",
    score: 85,
    date: "5h ago",
    author: "neo_matrix",
    industry: "SaaS",
    feasibility: "High"
  },
  {
    id: "T-004",
    title: "Potential Supply Chain Risk in npm package",
    severity: "medium",
    type: "Supply Chain",
    score: 62,
    date: "12h ago",
    author: "trinity",
    industry: "All",
    feasibility: "Probable"
  },
  {
    id: "T-005",
    title: "Zero-day in popular Kubernetes Ingress Controller",
    severity: "critical",
    type: "Infrastructure",
    score: 95,
    date: "1d ago",
    author: "morpheus",
    industry: "FinTech",
    feasibility: "High"
  },
  {
    id: "T-006",
    title: "IDOR vulnerability in Fintech Payment Gateway",
    severity: "high",
    type: "Web Application",
    score: 88,
    date: "1d ago",
    author: "cipher",
    industry: "FinTech",
    feasibility: "Confirmed"
  },
  {
    id: "T-007",
    title: "Sensitive data exposure in public git repo",
    severity: "medium",
    type: "OSINT",
    score: 55,
    date: "2d ago",
    author: "ghost",
    industry: "All",
    feasibility: "Low"
  }
];

export default function IntelFeed() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [selectedFeasibility, setSelectedFeasibility] = useState<string>("All");

  const filteredThreats = useMemo(() => {
    return ALL_THREATS.filter(threat => {
      const matchesSearch = threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry = selectedIndustry === "All" || threat.industry === selectedIndustry || threat.industry === "All";
      const matchesSeverity = selectedSeverity === "All" || threat.severity === selectedSeverity.toLowerCase();
      const matchesFeasibility = selectedFeasibility === "All" || threat.feasibility === selectedFeasibility;

      return matchesSearch && matchesIndustry && matchesSeverity && matchesFeasibility;
    });
  }, [searchTerm, selectedIndustry, selectedSeverity, selectedFeasibility]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("All");
    setSelectedSeverity("All");
    setSelectedFeasibility("All");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Intel Feed</h1>
          <p className="text-muted-foreground">Verified vulnerabilities and emerging threat patterns across the H3M4 network.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReportModal triggerLabel="Export Threat Intel" title="Ecosystem Threat Summary" />
          {user?.role === "researcher" && <DisclosureModal />}
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="flex flex-col gap-4 p-4 rounded-xl bg-card/40 border border-border backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by vulnerability, CVE, author, or tech stack..."
              className="w-full bg-background/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all ring-offset-background placeholder:text-muted-foreground/50"
            />
          </div>

          {(selectedIndustry !== "All" || selectedSeverity !== "All" || selectedFeasibility !== "All" || searchTerm !== "") && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-2 text-muted-foreground hover:text-destructive">
              <X className="h-3 w-3" /> Clear All
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {/* Industry Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-xs">
                <Filter className="h-3 w-3 text-primary" />
                Industry: <span className="text-primary font-bold">{selectedIndustry}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-sidebar border-white/10">
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Filter by Sector</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {["All", "FinTech", "SaaS", "GovTech", "Cloud"].map(industry => (
                <DropdownMenuItem
                  key={industry}
                  className="text-xs cursor-pointer focus:bg-primary/10 flex justify-between items-center"
                  onClick={() => setSelectedIndustry(industry)}
                >
                  {industry}
                  {selectedIndustry === industry && <Check className="h-3 w-3 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Severity Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-xs">
                <Badge variant="outline" className={`h-2 w-2 rounded-full p-0 border-none ${selectedSeverity === "Critical" ? "bg-destructive" :
                  selectedSeverity === "High" ? "bg-orange-500" :
                    selectedSeverity === "Medium" ? "bg-yellow-500" : "bg-primary"
                  }`} />
                Severity: <span className="text-primary font-bold">{selectedSeverity}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-sidebar border-white/10">
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Threat Severity</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {["All", "Critical", "High", "Medium", "Low"].map(severity => (
                <DropdownMenuItem
                  key={severity}
                  className="text-xs cursor-pointer focus:bg-primary/10 flex justify-between items-center"
                  onClick={() => setSelectedSeverity(severity)}
                >
                  {severity}
                  {selectedSeverity === severity && <Check className="h-3 w-3 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Feasibility Tool */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-xs">
                <Zap className="h-3 w-3 text-orange-400" />
                Exploit Feasibility: <span className="text-primary font-bold">{selectedFeasibility}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-sidebar border-white/10">
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Checking Feasibility Index</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {["All", "Confirmed", "High", "Probable", "Low"].map(feas => (
                <DropdownMenuItem
                  key={feas}
                  className="text-xs cursor-pointer focus:bg-primary/10 flex justify-between items-center"
                  onClick={() => setSelectedFeasibility(feas)}
                >
                  <div className="flex flex-col">
                    <span>{feas}</span>
                    <span className="text-[9px] text-muted-foreground">
                      {feas === 'Confirmed' && 'Validated by governance node POC'}
                      {feas === 'High' && 'Easily reproducible in lab'}
                      {feas === 'Probable' && 'Theoretically sound attack path'}
                    </span>
                  </div>
                  {selectedFeasibility === feas && <Check className="h-3 w-3 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Showing {filteredThreats.length} Active Intelligence Signals
        </h2>
        <div className="h-px flex-1 bg-white/5 mx-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThreats.length > 0 ? (
          filteredThreats.map((threat) => (
            // @ts-ignore
            <ThreatCard key={threat.id} {...threat} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4 border border-dashed border-white/10 rounded-2xl">
            <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No matching intelligence found</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Try adjusting your search terms or filters to find deeper threat signals.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}