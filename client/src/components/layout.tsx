import { Link, useLocation } from "wouter";
import { Shield, Activity, FileText, User, Search, Bell, Menu, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import heroBg from '@assets/generated_images/abstract_cyberpunk_security_background.png';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Shield, label: "Dashboard", href: "/" },
    { icon: Activity, label: "Intel Feed", href: "/intel" },
    { icon: FileText, label: "Submit Research", href: "/submit" },
    { icon: Target, label: "Mission Protocol", href: "/mission" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-hidden flex">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 z-0 bg-background/80 pointer-events-none backdrop-blur-[2px]" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-md z-20 hidden md:flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-8 w-8" />
            <h1 className="text-xl font-heading font-bold tracking-wider">H3M4<span className="text-foreground/70 text-sm font-normal ml-1">VAULT</span></h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group cursor-pointer",
                location === item.href 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(38,217,98,0.1)]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}>
                <item.icon className={cn("h-5 w-5", location === item.href && "text-primary")} />
                <span className="font-medium">{item.label}</span>
                {location === item.href && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_theme('colors.primary.DEFAULT')]" />
                )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="glass-panel p-4 rounded-lg">
            <p className="text-xs text-muted-foreground font-mono mb-2">SYSTEM STATUS</p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Operational
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="md:hidden">
            <Menu className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search threat intelligence..." 
                className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border border-background" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-bold text-xs">
              JS
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}