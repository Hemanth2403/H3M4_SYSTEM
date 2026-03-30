import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, Check, X, Zap } from "lucide-react";
import { ThreatCard } from "@/components/threat-card";
import { ReportModal } from "@/components/report-modal";
import { DisclosureModal } from "@/components/disclosure-modal";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
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

export default function IntelFeed() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [selectedFeasibility, setSelectedFeasibility] = useState<string>("All");

  // Fetch real submissions from API
  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  // Transform submissions into threat feed format
  const allThreats = useMemo(() => {
    return submissions
      .filter(sub => sub.status === "verified") // Only show verified threats
      .map(sub => ({
        id: sub.id,
        title: sub.title,
        severity: sub.severity,
        type: sub.category,
        score: sub.severity === "critical" ? 90 + Math.floor(Math.random() * 10) :
          sub.severity === "high" ? 75 + Math.floor(Math.random() * 15) :
            sub.severity === "medium" ? 50 + Math.floor(Math.random() * 25) :
              30 + Math.floor(Math.random() * 20),
        date: new Date(sub.submittedAt).toLocaleDateString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short'
        }),
        author: sub.author,
        authorTier: sub.author === "da_vinci" ? "ELITE" : sub.author === "ghost_shell" ? "ZERO-DAY-EXPERT" : "ACTIVE",
        industry: sub.category.includes("Cloud") ? "Cloud" :
          sub.category.includes("API") ? "SaaS" :
            sub.category.includes("Web") ? "FinTech" :
              "All",
        feasibility: sub.severity === "critical" ? "Confirmed" :
          sub.severity === "high" ? "High" :
            sub.severity === "medium" ? "Probable" : "Low",
        description: sub.description,
        impactAnalysis: sub.impactAnalysis || "",
        affectedSystems: sub.affectedSystems || "",
      }));
  }, [submissions]);

  const filteredThreats = useMemo(() => {
    return allThreats.filter(threat => {
      const matchesSearch = threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry = selectedIndustry === "All" || threat.industry === selectedIndustry || threat.industry === "All";
      const matchesSeverity = selectedSeverity === "All" || threat.severity === selectedSeverity.toLowerCase();
      const matchesFeasibility = selectedFeasibility === "All" || threat.feasibility === selectedFeasibility;

      return matchesSearch && matchesIndustry && matchesSeverity && matchesFeasibility;
    });
  }, [allThreats, searchTerm, selectedIndustry, selectedSeverity, selectedFeasibility]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("All");
    setSelectedSeverity("All");
    setSelectedFeasibility("All");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-10">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading threat intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">
            {user?.role === 'police' ? "Criminal Intelligence & Modus Operandi" : "Intel Feed"}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'police'
              ? "Verified threat signals and criminal methodologies across the financial ecosystem for law enforcement briefing."
              : "Verified vulnerabilities and emerging threat patterns across the H3M4 network."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ReportModal triggerLabel={user?.role === 'police' ? "Export Evidence Package" : "Export Threat Intel"} title={user?.role === 'police' ? "Criminal Intelligence Briefing" : "Ecosystem Threat Summary"} />
          {user?.role === "researcher" && <DisclosureModal />}
        </div>
      </div>

      {/* Real-time Intel Ticker */}
      <div className="bg-primary/5 border-y border-primary/20 flex overflow-hidden py-2 whitespace-nowrap relative">
        <div className="flex animate-marquee gap-8">
          {[
            "CRITICAL: OAuth bypass pattern detected in Shard #22",
            "ALERT: New Android RAT variant 'UPI-Interceptor' published by @da_vinci",
            "UPDATE: HDFC-Verify phishing kit source code archived to secure vault",
            "NETWORK: Validator consensus reached for Case #TC-882-X9",
            "INTEL: 12% surge in cross-tenant logic flaw attempts in SaaS sector"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary">
              <Zap className="h-3 w-3 fill-primary" /> {text}
            </div>
          ))}
        </div>
        <div className="flex absolute top-0 animate-marquee2 gap-8 py-2">
          {[
            "CRITICAL: OAuth bypass pattern detected in Shard #22",
            "ALERT: New Android RAT variant 'UPI-Interceptor' published by @da_vinci",
            "UPDATE: HDFC-Verify phishing kit source code archived to secure vault",
            "NETWORK: Validator consensus reached for Case #TC-882-X9",
            "INTEL: 12% surge in cross-tenant logic flaw attempts in SaaS sector"
          ].map((text, i) => (
            <div key={i + 10} className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary">
              <Zap className="h-3 w-3 fill-primary" /> {text}
            </div>
          ))}
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
              <h3 className="text-lg font-bold">No verified threats yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {allThreats.length === 0
                  ? "Submit your research to populate the intel feed."
                  : "Try adjusting your search terms or filters to find deeper threat signals."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}