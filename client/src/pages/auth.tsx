import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Shield, Lock, Building2, UserCircle, Scale, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from '@assets/generated_images/abstract_cyberpunk_security_background.png';
import { toast } from "sonner";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"researcher" | "enterprise" | "admin" | "police">("researcher");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictiveKey] = useState(() => `H3M4-${Math.random().toString(36).substring(2, 10).toUpperCase()}-XXXX`);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name) {
      toast.error("Authentication Error", { description: "Please enter both Username and Display Name" });
      return;
    }

    setIsSubmitting(true);
    try {
      // For this demo, we use a "Register-or-Login" flow
      // We'll try to register first. If it fails with "already exists", we login.
      try {
        await register({
          username,
          password: "password", // Static password for demo convenience
          name,
          role: selectedRole,
          avatar: name.substring(0, 2).toUpperCase()
        });
      } catch (err: any) {
        if (err.message.includes("already exists") || err.message.includes("400")) {
          // User likely already exists, attempt login
          await login({ username, password: "password" });
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Auth flow failed:", err);
    } finally {
      setIsSubmitting(false);
    }
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
        className="w-full max-w-lg p-8 glass-panel rounded-xl border border-white/10 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/30">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-wider mb-2">H3M4<span className="text-foreground/70 text-sm font-normal ml-1">ACCESS</span></h1>
          <p className="text-muted-foreground text-sm">Enter your unique credentials to access the ecosystem.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "researcher", label: "Researcher", icon: UserCircle, color: "primary", desc: "Security Expert" },
              { id: "enterprise", label: "Enterprise", icon: Building2, color: "secondary", desc: "Organization" },
              { id: "police", label: "Police", icon: Scale, color: "blue-500", desc: "Law Enforcement" },
              { id: "admin", label: "Admin", icon: Lock, color: "destructive", desc: "System Control" }
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selectedRole === role.id
                  ? `bg-${role.color}/20 border-${role.color} text-${role.color} ring-2 ring-${role.color}/50`
                  : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5"
                  }`}
              >
                <role.icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{role.label}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">{role.desc}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                <Terminal className="h-3 w-3" /> Unique_Username
              </label>
              <input
                type="text"
                placeholder="e.g. cyber_zero"
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                <UserCircle className="h-3 w-3" /> Display_Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="p-3 rounded border border-white/5 bg-black/20 space-y-1.5 ring-1 ring-white/5">
              <label className="text-[9px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Lock className="h-2.5 w-2.5" /> Assigned_Identity_Key
              </label>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-primary/80 tracking-widest">{predictiveKey}</span>
                <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">PREDICTIVE</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${selectedRole === "researcher" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                selectedRole === "enterprise" ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" :
                  selectedRole === "police" ? "bg-blue-500 text-white hover:bg-blue-600" :
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                }`}
            >
              {isSubmitting ? "SYNCHRONIZING..." : "INITIATE SESSION"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-[10px] text-muted-foreground font-mono space-y-1">
          <p>SECURE CONNECTION ESTABLISHED</p>
          <p>DEVICE_TUNNEL: ACTIVE</p>
          <p>CRYPTO_SHARD: RSA-4096 / AES-GCM</p>
        </div>
      </motion.div>
    </div>
  );
}