import { useState } from "react";
import { Check, X, Eye, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Submission {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  severity: string;
  description: string;
}

export default function AdminReview() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 101,
      title: "Unauthenticated RCE in User Profile Service",
      author: "neo_matrix",
      date: "2024-12-16",
      category: "API Security",
      status: "pending",
      severity: "critical",
      description: "A remote code execution vulnerability exists in the user profile upload endpoint due to improper sanitization of file names..."
    },
    {
      id: 102,
      title: "Leaked AWS Keys in Client-Side Bundle",
      author: "trinity",
      date: "2024-12-17",
      category: "Cloud Security",
      status: "pending",
      severity: "high",
      description: "Found hardcoded AWS access keys in the main.js bundle file accessible to any unauthenticated user..."
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const handleApprove = () => {
    if (!selectedSubmission) return;
    toast({
      title: "Submission Approved",
      description: `Threat Score assigned. Notification sent to ${selectedSubmission.author}.`,
    });
    setSubmissions(submissions.filter(s => s.id !== selectedSubmission.id));
    setSelectedSubmission(null);
  };

  const handleReject = () => {
    if (!selectedSubmission) return;
    toast({
      title: "Submission Rejected",
      description: "Feedback sent to researcher.",
      variant: "destructive"
    });
    setSubmissions(submissions.filter(s => s.id !== selectedSubmission.id));
    setSelectedSubmission(null);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex gap-6 animate-in fade-in duration-500">
      {/* List Column */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-heading font-bold">Review Queue</h2>
          <Badge variant="outline" className="text-muted-foreground">{submissions.length} Pending</Badge>
        </div>
        
        <div className="flex-1 overflow-auto space-y-3 pr-2">
          {submissions.map((sub) => (
            <div 
              key={sub.id}
              onClick={() => setSelectedSubmission(sub)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedSubmission?.id === sub.id 
                  ? "bg-primary/10 border-primary shadow-[0_0_10px_rgba(38,217,98,0.1)]" 
                  : "bg-card/40 border-border hover:bg-white/5"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-muted-foreground">#{sub.id}</span>
                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                  sub.severity === 'critical' ? 'text-destructive border-destructive/30 bg-destructive/10' :
                  'text-orange-500 border-orange-500/30 bg-orange-500/10'
                }`}>
                  {sub.severity}
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-1 line-clamp-1">{sub.title}</h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{sub.author}</span>
                <span>{sub.date}</span>
              </div>
            </div>
          ))}
          
          {submissions.length === 0 && (
            <div className="text-center p-8 border border-dashed border-white/10 rounded-lg text-muted-foreground">
              <Check className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>All caught up!</p>
            </div>
          )}
        </div>
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
                  <div className="p-3 rounded bg-black/20 border border-white/5 text-sm">
                    • User Profile Service (v2.1)<br/>
                    • AWS S3 Buckets (Production)
                  </div>
                 </div>
                 <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Compliance Impact</label>
                  <div className="p-3 rounded bg-black/20 border border-white/5 text-sm">
                    • GDPR Article 32<br/>
                    • ISO 27001 A.14.2
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

              {/* Translation Layer Input */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <label className="text-sm font-bold text-foreground">Intelligence Translation Layer</label>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Executive Summary</label>
                    <Textarea 
                      placeholder="High-level business impact summary..." 
                      className="bg-background/50 border-white/10 min-h-[80px]"
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
                  <Check className="h-4 w-4 mr-2" /> Verify & Publish
                </Button>
              </div>
            </div>
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