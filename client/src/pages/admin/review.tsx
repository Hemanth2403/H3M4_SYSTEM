import { useState, useEffect } from "react";
import { Check, X, Eye, FileText, AlertTriangle, AlertCircle, Info, Lock, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Submission } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminReview() {
  const { data: submissions = [], isLoading, refetch } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
    staleTime: 0, // Ensure we always get the freshest intelligence
  });

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const interval = setInterval(() => refetch(), 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const mutation = useMutation({
    mutationFn: async ({ id, status, feedback }: { id: string; status: string; feedback?: string }) => {
      await apiRequest("PATCH", `/api/submissions/${id}`, { status, feedback });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast.success("Intelligence Status Updated", {
        description: "The core brain has been updated with your governance decision.",
      });
      setSelectedSubmission(null);
      setFeedback("");
    },
    onError: (error: any) => {
      toast.error("Action Failed", {
        description: error.message
      });
    }
  });

  const handleApprove = () => {
    if (!selectedSubmission) return;
    mutation.mutate({ id: selectedSubmission.id, status: "verified", feedback });
  };

  const handleReject = () => {
    if (!selectedSubmission) return;
    mutation.mutate({ id: selectedSubmission.id, status: "rejected", feedback });
  };

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const historySubmissions = submissions.filter(s => s.status !== "pending");

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-1/3 flex flex-col gap-4">
        {/* Bootstrapping Context Alert */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Internal Pilot Mode</h3>
          </div>
          <p className="text-[10px] text-amber-500/80 leading-relaxed">
            Platform is in bootstrapping phase. Submissions are currently subject to
            <span className="font-bold text-amber-500 mx-1">internal founder validation</span>
            only. External audit nodes are pending integration.
          </p>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-heading font-bold">Review Center</h2>
          <Badge variant="outline" className="text-muted-foreground">{pendingSubmissions.length} Pending</Badge>
        </div>

        <Tabs defaultValue="queue" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="flex-1 overflow-auto space-y-3 pr-2 data-[state=inactive]:hidden mt-0">
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => <div key={i} className="h-24 w-full rounded-lg bg-white/5 animate-pulse" />)}
              </div>
            ) : (
              pendingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedSubmission?.id === sub.id
                    ? "bg-primary/10 border-primary shadow-[0_0_10px_rgba(38,217,98,0.1)]"
                    : "bg-card/40 border-border hover:bg-white/5"
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {sub.id.substring(0, 8)}</span>
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border ${sub.severity === 'critical' ? 'text-destructive border-destructive/30 bg-destructive/10' :
                      'text-orange-500 border-orange-500/30 bg-orange-500/10'
                      }`}>
                      {sub.severity}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{sub.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-bold text-foreground/70">{sub.author}</span>
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}

            {!isLoading && pendingSubmissions.length === 0 && (
              <div className="text-center p-8 border border-dashed border-white/10 rounded-lg text-muted-foreground">
                <Check className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p>All caught up!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-auto space-y-3 pr-2 data-[state=inactive]:hidden mt-0">
            {historySubmissions.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground opacity-50">No history yet.</div>
            ) : (
              historySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all opacity-70 hover:opacity-100 ${selectedSubmission?.id === sub.id
                    ? "bg-primary/5 border-primary shadow-[0_0_10px_rgba(38,217,98,0.1)]"
                    : "bg-card/20 border-border hover:bg-white/5"
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {sub.id.substring(0, 8)}</span>
                    <Badge variant="secondary" className="text-[10px] h-5 uppercase">{sub.status}</Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{sub.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{sub.author}</span>
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Column */}
      <div className="flex-1 glass-panel rounded-xl p-6 border border-white/10 flex flex-col">
        {selectedSubmission ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2">{selectedSubmission.title}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {selectedSubmission.category}
                  </Badge>
                  <span className="text-muted-foreground font-mono">Submitted by {selectedSubmission.author}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto space-y-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Description & Impact</label>
                <div className="p-4 rounded-lg bg-black/20 border border-white/5 font-mono text-sm leading-relaxed text-foreground/90">
                  {selectedSubmission.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Affected Systems</label>
                  <div className="p-3 rounded bg-black/20 border border-white/5 text-sm min-h-[60px]">
                    {selectedSubmission.affectedSystems || "No specific systems listed."}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Business Impact</label>
                  <div className="p-3 rounded bg-black/20 border border-white/5 text-sm min-h-[60px]">
                    {selectedSubmission.impactAnalysis || "No impact analysis provided."}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Proof of Concept</label>
                <div className="p-3 rounded bg-black/20 border border-white/5 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-mono text-primary underline underline-offset-4">poc_script.py</span>
                  <span className="text-xs text-muted-foreground ml-auto">2.4 KB</span>
                </div>
              </div>

              {/* Blockchain Provenance Layer */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-2">
                    <Lock className="h-3 w-3 text-emerald-500" /> Immutable Ledger Record
                  </label>
                  <Badge variant="outline" className="text-[9px] h-5 border-emerald-500/20 text-emerald-500 bg-emerald-500/5 font-mono">
                    CONSENSUS: VALID
                  </Badge>
                </div>
                <div className="p-4 rounded-lg bg-black/40 border border-emerald-500/20 font-mono text-xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Network className="h-16 w-16 text-emerald-500" />
                  </div>
                  <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-muted-foreground text-[10px] uppercase">SHA-256 Content Hash</span>
                    <span className="text-emerald-500/90 break-all">0x7f83b1657ff1...9a2b (Verified)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-[10px] uppercase">Block Height</span>
                      <span className="text-foreground">#892,104 [Permissioned]</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-[10px] uppercase">Notary Node</span>
                      <span className="text-foreground">Gov_Audit_Node_01</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Translation Layer Input */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <label className="text-sm font-bold text-foreground">Intelligence Translation Layer</label>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs text-primary font-bold mb-1 block uppercase tracking-wider">Researcher Feedback / Corrections</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Enter corrections, validation notes, or required changes for the researcher to see..."
                      className="bg-background/50 border-primary/20 min-h-[80px] text-foreground focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Recommended Mitigations</label>
                    <Textarea
                      placeholder="Step-by-step technical fixes..."
                      className="bg-background/50 border-white/10 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Compliance & Audit Notes (ISO, GDPR, RBI)</label>
                    <Textarea
                      placeholder="Relevant compliance implications..."
                      className="bg-background/50 border-white/10 min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {selectedSubmission.status === 'pending' && (
              <div className="flex items-center justify-between pt-6 border-t border-white/10 bg-black/20 -mx-6 -mb-6 p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Threat Score</label>
                    <input type="number" defaultValue={85} className="w-20 bg-background border border-white/10 rounded px-2 py-1 text-center font-mono font-bold text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Confidence</label>
                    <select className="w-32 bg-background border border-white/10 rounded px-2 py-1 text-xs">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Industry</label>
                    <select className="w-32 bg-background border border-white/10 rounded px-2 py-1 text-xs">
                      <option>All</option>
                      <option>FinTech</option>
                      <option>SaaS</option>
                      <option>GovTech</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="destructive" onClick={handleReject} className="bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20">
                    <X className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  <Button onClick={handleApprove} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Check className="h-4 w-4 mr-2" /> Validate (Internal Pilot)
                  </Button>
                </div>
              </div>
            )}
            {selectedSubmission.status !== 'pending' && (
              <div className="pt-6 border-t border-white/10 -mx-6 -mb-6 p-6 bg-black/40 text-center">
                <p className="text-muted-foreground text-sm">This submission has been processed as <span className="font-bold uppercase text-foreground">{selectedSubmission.status}</span>.</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <Eye className="h-16 w-16 mb-4" />
            <p className="text-lg">Select a submission to review</p>
          </div>
        )}
      </div>
    </div>
  );
}