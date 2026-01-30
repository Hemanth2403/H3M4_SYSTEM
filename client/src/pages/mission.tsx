import { Terminal, ShieldAlert, Zap, Lock, Globe, CheckCircle2, Crosshair, Award, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "wouter";

export default function Mission() {
  const [isVoteOpen, setIsVoteOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isStakingOpen, setIsStakingOpen] = useState(false);
  const [voteType, setVoteType] = useState<"Affirmative" | "Negative" | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleVote = (type: "Affirmative" | "Negative") => {
    setVoteType(type);
    setIsVoteOpen(true);
  };

  const confirmVote = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setIsVoteOpen(false);
      toast.success(`${voteType} Vote Recorded`, {
        description: `Signal anchored on Shard #881 via Peer_v4.`,
      });
    }, 2500);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-12">
        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 ring-1 ring-primary/30 mb-2"
              >
                <Terminal className="h-6 w-6 text-primary" />
              </motion.div>
              <h1 className="text-4xl font-heading font-bold tracking-tight">The H3M4 Protocol</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Bridging the gap between independent security research and enterprise defense via a decentralized, forensic-grade intelligence ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Statement */}
              <div className="glass-panel p-6 rounded-xl border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldAlert className="h-24 w-24" />
                </div>
                <h2 className="text-lg font-bold mb-3 text-destructive/80 flex items-center gap-2">
                  <Crosshair className="h-4 w-4" /> The Disconnect
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cybersecurity research is fragmented. Insights produced by independent researchers are often unverified and difficult for businesses to operationalize. H3M4 converts this raw data into verified, court-safe intelligence.
                </p>
              </div>

              {/* Solution Statement */}
              <div className="glass-panel p-6 rounded-xl border-primary/20 bg-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="h-24 w-24 text-primary" />
                </div>
                <h2 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> The H3M4 Vault
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We provide a system that ensures ethical disclosure and fair compensation. By validating and structuring this data, we enable proactive defense against emerging patterns before they become widespread exploits.
                </p>
              </div>
            </div>

            {/* Collaborative Governance Section */}
            <Card className="bg-card/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Radio className="h-4 w-4 text-orange-500 animate-pulse" /> Consensus Governance Node [Voting Active]
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold">Proposal #442: Mandatory SHA-3-384 Notary for Shard #881</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">Increasing forensic depth for government-tier intelligence nodes.</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/20">QUORUM MET</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>AFFIRMATIVE (FOR)</span>
                        <span className="text-primary font-bold">88.2%</span>
                      </div>
                      <Progress value={88} className="h-1 bg-white/5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>NEGATIVE (AGAINST)</span>
                        <span className="text-destructive font-bold">11.8%</span>
                      </div>
                      <Progress value={11.8} className="h-1 bg-white/5 [&>div]:bg-destructive" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVote("Affirmative")}
                      className="flex-1 bg-[#26d962] hover:bg-[#26d962]/90 text-black font-bold h-7"
                    >
                      VOTE_AFFIRMATIVE
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote("Negative")}
                      className="flex-1 border-white/10 h-7"
                    >
                      VOTE_NEGATIVE
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Live Mission Briefing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: "Operation Shadow-Mirror", stat: "84% Complete", color: "text-primary" },
                    { label: "Genesis Shard Migration", stat: "Active", color: "text-orange-500" },
                    { label: "Vault 4 Recrypt", stat: "Scheduled", color: "text-muted-foreground" }
                  ].map((mission, i) => (
                    <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-xs font-bold">{mission.label}</span>
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-mono ${mission.color}`}>{mission.stat}</span>
                        {mission.color === 'text-primary' && <CheckCircle2 className="h-3 w-3 text-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setIsJoinOpen(true)}
                  className="w-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 text-[10px] font-bold h-8"
                >
                  JOIN ACTIVE OPERATION
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/20 border-white/5 overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-[#1a2b3b] to-black p-4 flex flex-col justify-end border-b border-white/5">
                <Award className="h-6 w-6 text-primary mb-2" />
                <h3 className="text-xs font-heading font-bold uppercase tracking-widest">Ecosystem Perks</h3>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Top Tier Rewards</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    Verified researchers get direct access to institutional priority feed and high-value bounty pools.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsStakingOpen(true)}
                    className="w-full text-[10px] h-7 border-white/10"
                  >
                    LEARN_ABOUT_STAKING
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Voting Modal */}
      <Dialog open={isVoteOpen} onOpenChange={setIsVoteOpen}>
        <DialogContent className="max-w-md bg-[#0a0f14] border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(38,217,98,0.15)]">
          {!isBroadcasting ? (
            <>
              <div className="p-8 bg-black/40 border-b border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[9px] font-mono border-orange-500/30 text-orange-500 uppercase tracking-widest">Governance Ref: #442</Badge>
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                </div>
                <DialogTitle className="text-xl font-heading font-bold text-white leading-tight">
                  Confirm {voteType} Signal for SHA-3-384 Mandate
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
                  You are anchoring your researcher reputation to this proposal. This action is immutable across the H3M4 Global Ledger.
                </DialogDescription>
              </div>
              <div className="p-8 space-y-4 bg-black/20">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground">
                    <span>Vote Direction:</span>
                    <span className={voteType === 'Affirmative' ? 'text-primary' : 'text-destructive'}>{voteType}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground">
                    <span>Est. Rep Weight:</span>
                    <span className="text-white">1,240 Rep</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground">
                    <span>Network Fee:</span>
                    <span className="text-white">0.0004 H3M4</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3">
                <Button variant="outline" className="flex-1 h-9 text-[10px] border-white/10" onClick={() => setIsVoteOpen(false)}>CANCEL</Button>
                <Button className="flex-1 h-9 bg-primary text-black font-bold text-[10px]" onClick={confirmVote}>CONFIRM_ANCHOR</Button>
              </div>
            </>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-16 w-16 rounded-full border-t-2 border-primary border-r-2 border-transparent"
                />
                <Radio className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest">Broadcasting Hash</h3>
                <p className="text-[10px] font-mono text-muted-foreground animate-pulse">0x8f2d...b92q | SYNCING WITH QUORUM</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Join Operation Modal */}
      <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
        <DialogContent className="max-w-2xl bg-[#0a0f14] border-white/10 p-0 overflow-hidden">
          <div className="p-8 bg-primary/5 border-b border-white/5 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Crosshair className="h-24 w-24 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-heading font-bold mb-2">Operation Deployment Hub</DialogTitle>
            <DialogDescription className="text-muted-foreground">Select an active operational theatre to initiate neural link synchronization.</DialogDescription>
          </div>
          <div className="p-8 space-y-4">
            {[
              { id: "SHADOW-MIRROR", title: "Operation Shadow-Mirror", difficulty: "High", pool: "2.4 BTC", active: true },
              { id: "GENESIS-MIGRATE", title: "Genesis Shard Migration", difficulty: "Medium", pool: "1.2 BTC", active: true },
            ].map(op => (
              <div key={op.id} className="group p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/50 transition-all flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold group-hover:text-primary transition-colors">{op.title}</div>
                  <div className="flex gap-3 text-[9px] font-mono text-muted-foreground">
                    <span>DIFF: <span className="text-orange-500">{op.difficulty}</span></span>
                    <span>BOUNTY_POOL: <span className="text-primary">{op.pool}</span></span>
                  </div>
                </div>
                <Link href="/missions">
                  <Button size="sm" onClick={() => setIsJoinOpen(false)} className="h-7 text-[10px] bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">DEPLOY</Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="p-4 bg-black/40 border-t border-white/5 text-center">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-mono">Deployment requires valid H3M4 security clearance level 3.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staking Modal */}
      <Dialog open={isStakingOpen} onOpenChange={setIsStakingOpen}>
        <DialogContent className="max-w-md bg-[#0a0f14] border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(255,165,0,0.1)]">
          <div className="p-8 bg-orange-500/5 border-b border-orange-500/10 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award className="h-24 w-24 text-orange-500" />
            </div>
            <DialogTitle className="text-xl font-heading font-bold mb-1">Ecosystem Staking v2.1</DialogTitle>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Reward Protocol: Passive Integrity Yield</p>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Current APR</span>
                <div className="text-xl font-mono font-bold text-primary">12.4%</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Active Stake</span>
                <div className="text-xl font-mono font-bold">2,450 Rep</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Governance Benefits</h4>
              <ul className="space-y-3">
                {[
                  "3x Weight on System Proposals",
                  "Early Access to High-Value Mission Briefs",
                  "Priority Shard Validation Rights"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full bg-primary text-black font-bold text-[10px] h-10 shadow-[0_0_20px_rgba(var(--primary),0.2)]" onClick={() => toast.info("Vault Lock Engaged", { description: "Staking requires administrative hardware authorization." })}>
              INCREASE REPUTATION STAKE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}