import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Shield, Lock, Building2, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from '@assets/generated_images/abstract_cyberpunk_security_background.png';

export default function AuthPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"researcher" | "enterprise" | "admin">("researcher");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 glass-panel rounded-xl border border-white/10 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/30">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-wider mb-2">H3M4<span className="text-foreground/70 text-sm font-normal ml-1">ACCESS</span></h1>
          <p className="text-muted-foreground text-sm">Select your clearance level to proceed.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole("researcher")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                selectedRole === "researcher" 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5"
              }`}
            >
              <UserCircle className="h-6 w-6 mb-2" />
              <span className="text-xs font-medium">Researcher</span>
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedRole("enterprise")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                selectedRole === "enterprise" 
                  ? "bg-secondary/20 border-secondary text-secondary" 
                  : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5"
              }`}
            >
              <Building2 className="h-6 w-6 mb-2" />
              <span className="text-xs font-medium">Enterprise</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                selectedRole === "admin" 
                  ? "bg-destructive/20 border-destructive text-destructive" 
                  : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5"
              }`}
            >
              <Lock className="h-6 w-6 mb-2" />
              <span className="text-xs font-medium">Admin</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">IDENTITY_TOKEN</label>
              <input 
                type="text" 
                defaultValue="demo-user-access-token"
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
                readOnly
              />
            </div>
            
            <button 
              type="submit" 
              className={`w-full py-3 rounded-md font-bold text-sm transition-all ${
                selectedRole === "researcher" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                selectedRole === "enterprise" ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" :
                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }`}
            >
              INITIATE SESSION
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground font-mono">
          <p>SECURE CONNECTION ESTABLISHED</p>
          <p>ENCRYPTION: AES-256-GCM</p>
        </div>
      </motion.div>
    </div>
  );
}