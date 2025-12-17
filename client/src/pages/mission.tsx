import { Terminal, ShieldAlert, Zap, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Mission() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 ring-1 ring-primary/30 mb-2"
        >
          <Terminal className="h-8 w-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">The H3M4 Protocol</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Bridging the gap between independent security research and enterprise defense.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Problem Statement */}
        <div className="glass-panel p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="h-32 w-32" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-4 text-destructive">The Disconnect</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Cybersecurity research is fragmented.</strong> Valuable insights produced by hackers and independent researchers are often unverified and difficult for businesses to operationalize.
            </p>
            <p>
              Most organizations rely on <strong className="text-foreground">reactive measures</strong>—periodic audits and bug bounties that only address vulnerabilities after they exist. This leaves a critical gap where emerging threats go unnoticed until it's too late.
            </p>
            <p>
              Meanwhile, genuine researchers lack a trusted platform to validate their work, gain recognition, and earn a sustainable income, driving talent underground.
            </p>
          </div>
        </div>

        {/* Solution Statement */}
        <div className="glass-panel p-8 rounded-xl relative overflow-hidden group border-primary/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="h-32 w-32 text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-4 text-primary">The Solution</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">H3M4 Security Vault</strong> is the missing link. We convert real-world security research into verified, business-ready threat intelligence.
            </p>
            <p>
              We provide a system that ensures <strong className="text-foreground">ethical disclosure</strong> and <strong className="text-foreground">fair compensation</strong>, creating a symbiotic relationship between researchers and enterprises.
            </p>
            <p>
              By validating and structuring this data, we enable proactive defense against emerging attack patterns before they become widespread exploits.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values / Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/30 border border-border p-6 rounded-lg text-center hover:bg-card/50 transition-colors">
          <Lock className="h-10 w-10 text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Verified Intelligence</h3>
          <p className="text-sm text-muted-foreground">Every submission is rigorously tested and scored before reaching the enterprise feed.</p>
        </div>
        <div className="bg-card/30 border border-border p-6 rounded-lg text-center hover:bg-card/50 transition-colors">
          <Globe className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Global Community</h3>
          <p className="text-sm text-muted-foreground">Uniting the world's best ethical hackers with forward-thinking security teams.</p>
        </div>
        <div className="bg-card/30 border border-border p-6 rounded-lg text-center hover:bg-card/50 transition-colors">
          <Zap className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Proactive Defense</h3>
          <p className="text-sm text-muted-foreground">Shifting the industry from reactive patching to predictive threat mitigation.</p>
        </div>
      </div>
    </div>
  );
}