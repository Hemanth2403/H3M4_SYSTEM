import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    ShieldAlert,
    Send,
    Loader2,
    CheckCircle2,
    Target,
    FileCode,
    Activity,
    Lock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function DisclosureModal() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "Web Application",
        severity: "Medium",
        description: "",
        target: ""
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/submissions", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
        }
    });

    const handleNext = () => {
        if (step === 1) setStep(2);
    };

    const handleSubmission = () => {
        setStep(3);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);
            if (currentProgress >= 100) {
                clearInterval(interval);

                mutation.mutate({
                    ...formData,
                    userId: user?.id,
                    author: user?.name,
                    status: "pending",
                    submittedAt: new Date().toISOString()
                }, {
                    onSuccess: () => {
                        setStep(4);
                        toast.success("Intelligence Submitted Successfully", {
                            description: "Your vulnerability disclosure is now in the governance review queue.",
                        });
                    }
                });
            }
        }, 300);
    };

    const reset = () => {
        setOpen(false);
        setStep(1);
        setProgress(0);
        setFormData({
            title: "",
            category: "Web Application",
            severity: "Medium",
            description: "",
            target: ""
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-black font-bold gap-2 hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                    <ShieldAlert className="h-4 w-4" /> SUBMIT NEW INTELLIGENCE
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-sidebar/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden rounded-2xl">
                <div className="bg-primary/10 p-6 border-b border-white/5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading font-bold flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                            Vulnerability Disclosure Pipeline
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest pt-1">
                            Secure E2EE Submission Node: ACTIVE
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Threat Title</label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm focus:border-primary/50 outline-none"
                                    placeholder="Ex: Stored XSS in /api/v1/profile..."
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Tech Category</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm focus:border-primary/50 outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Web Application</option>
                                        <option>Cloud Infrastructure</option>
                                        <option>API Security</option>
                                        <option>Smart Contract</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Initial Severity</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm focus:border-primary/50 outline-none"
                                        value={formData.severity}
                                        onChange={e => setFormData({ ...formData, severity: e.target.value })}
                                    >
                                        <option>Critical</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Vulnerability Target (URL/Asset)</label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-3 text-sm focus:border-primary/50 outline-none"
                                        placeholder="https://vault.target.com/..."
                                        value={formData.target}
                                        onChange={e => setFormData({ ...formData, target: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Payload Analysis & PoC</label>
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-md py-3 px-3 text-xs font-mono min-h-[150px] focus:border-primary/50 outline-none resize-none"
                                    placeholder="Provide a detailed technical breakdown or raw payload..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3">
                                <Lock className="h-4 w-4 text-primary" />
                                <span className="text-[10px] text-muted-foreground italic">Your submission will be SHA-256 hashed and anchored to the H3M4 ledger.</span>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-10 text-center space-y-6">
                            <div className="flex justify-center flex-col items-center gap-4">
                                <div className="relative h-16 w-16">
                                    <Loader2 className="h-16 w-16 text-primary animate-spin opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ShieldAlert className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-lg font-bold">Transmitting Intelligence</div>
                                    <div className="text-xs text-muted-foreground font-mono">ENCRYPTING_PAYLOAD_TUNNEL_{progress}%</div>
                                </div>
                                <Progress value={progress} className="h-1.5 w-full max-w-xs" />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="py-10 text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-center flex-col items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-lg font-bold">Submitted Successfully</div>
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                        Transparency ID: <span className="text-primary font-mono tracking-tighter">H3M4-{(Math.random() * 10000).toFixed(0)}</span>
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                                    Your research has been successfully transmitted and indexed.
                                    Awaiting governance node review for verification.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-black/20 border-t border-white/5 gap-3 sm:gap-0">
                    {step < 3 && (
                        <>
                            <Button variant="ghost" onClick={() => step === 1 ? setOpen(false) : setStep(1)}>
                                {step === 1 ? "CANCEL" : "BACK"}
                            </Button>
                            <Button
                                onClick={step === 1 ? handleNext : handleSubmission}
                                disabled={step === 1 ? !formData.title || !formData.target : !formData.description}
                                className="bg-primary text-black font-bold gap-2 px-8"
                            >
                                {step === 1 ? "NEXT STEP" : "SUBMIT INTEL"} <Send className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    {step === 4 && (
                        <Button onClick={reset} className="w-full bg-primary text-black font-bold">
                            CONTINUE TO TRACKER
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
