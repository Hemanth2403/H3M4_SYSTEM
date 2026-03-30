import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Activity, FileText, User, Search, Bell, Menu, Target, LogOut, Lock, Zap, Home, LayoutDashboard, Eye, X, History as HistoryIcon, Database, Radio, Scale, Fingerprint, AlertTriangle, Building2, LineChart, ShieldCheck, Users, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import heroBg from '@assets/generated_images/abstract_cyberpunk_security_background.png';
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CommandPalette } from "@/components/command-palette";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Notification } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 5000,
    enabled: !!user,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    }
  });

  const unreadCount = notifications.filter(n => n.isRead === "false").length;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const getNavItems = () => {
    // ADMIN NAVIGATION - Full platform oversight
    if (user?.role === 'admin') {
      return [
        { icon: Home, label: "Platform Home", href: "/home" },
        { icon: LayoutDashboard, label: "System Dashboard", href: "/dashboard" },
        { icon: Radio, label: "War Room (CDOC)", href: "/cdoc" },
        { icon: Lock, label: "Review Queue", href: "/admin/review" },
        { icon: Shield, label: "Intel Registry", href: "/admin/registry" },
        { icon: Users, label: "Researcher Management", href: "/admin/researchers" },
        { icon: Building2, label: "Enterprise Management", href: "/admin/enterprises" },
        { icon: ShieldCheck, label: "Compliance Monitor", href: "/admin/compliance" },
        { icon: Database, label: "Evidence Store", href: "/admin/logs" },
        { icon: Activity, label: "Threat Graph", href: "/admin/graph" },
      ];
    }

    // POLICE NAVIGATION - Investigation & Evidence focus
    if (user?.role === 'police') {
      return [
        { icon: Home, label: "Platform Home", href: "/home" },
        { icon: Scale, label: "Police Dashboard", href: "/police" },
        { icon: Activity, label: "Intel Feed", href: "/intel" },
        { icon: Database, label: "Evidence Vault", href: "/police/evidence" },
        { icon: AlertTriangle, label: "Case Analysis", href: "/police/analysis" },
        { icon: User, label: "My Profile", href: "/profile" },
      ];
    }

    // ENTERPRISE NAVIGATION - Corporate security & risk management
    if (user?.role === 'enterprise') {
      return [
        { icon: Home, label: "Platform Home", href: "/home" },
        { icon: LayoutDashboard, label: "Risk Dashboard", href: "/dashboard" },
        { icon: Network, label: "Wazuh Infrastructure", href: "/enterprise/infrastructure" },
        { icon: Radio, label: "War Room (CDOC)", href: "/cdoc" },
        { icon: Activity, label: "Intel Feed", href: "/intel" },
        { icon: AlertTriangle, label: "Threat Monitor", href: "/technical-case" },
        { icon: LineChart, label: "Analytics", href: "/ledger" },
        { icon: ShieldCheck, label: "Compliance", href: "/admin/compliance" },
        { icon: Building2, label: "Company Profile", href: "/profile" },
      ];
    }

    // RESEARCHER NAVIGATION - Research & submission focus
    return [
      { icon: Home, label: "Platform Home", href: "/home" },
      { icon: LayoutDashboard, label: "My Dashboard", href: "/dashboard" },
      { icon: FileText, label: "Submit Research", href: "/submit" },
      { icon: Activity, label: "Intel Feed", href: "/intel" },
      { icon: HistoryIcon, label: "Research Activity", href: "/activity" },
      { icon: Zap, label: "Test Missions", href: "/missions" },
      { icon: Target, label: "Mission Status", href: "/mission" },
      { icon: User, label: "My Profile", href: "/profile" },
    ];
  };

  const navItems = getNavItems();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Zap className="h-12 w-12 text-primary animate-pulse" />
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
          </div>
          <p className="text-[10px] font-mono text-muted-foreground animate-pulse">AUTHENTICATING_SESSION...</p>
        </div>
      </div>
    );
  }

  // If no user, show simple layout or redirect (handled by App.tsx)
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-hidden flex">
      <CommandPalette />
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-md z-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col h-full",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-sidebar-border">
          <div
            onClick={() => logout()}
            className="flex items-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-opacity"
            title="Quick Disconnect (Switch Role)"
          >
            <Shield className="h-8 w-8" />
            <h1 className="text-xl font-heading font-bold tracking-wider">H3M4<span className="text-foreground/70 text-sm font-normal ml-1">VAULT</span></h1>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </button>

          <div className="mt-4 flex flex-col gap-1">
            <div className="text-xs font-mono text-muted-foreground uppercase">
              {user.role} ACCESS
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 -ml-1 rounded bg-amber-500/10 border border-amber-500/20 w-fit">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-tighter">
                Bootstrapping: Pilot Mode
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 group cursor-pointer",
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

        <div className="p-4 border-t border-white/5 space-y-4">
          {/* Global Shard Pulse */}
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
                <Radio className="h-3 w-3 animate-pulse" /> Shard Pulse
              </span>
              <Badge variant="outline" className="text-[8px] h-4 border-orange-500/20 text-orange-500">SYNCING</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">HEIGHT:</span>
                <span className="text-orange-500">#892,106</span>
              </div>
              <Progress value={85} className="h-0.5 bg-orange-500/10 [&>div]:bg-orange-500" />
              <div className="text-[8px] text-muted-foreground font-mono uppercase text-right">0.8s Integrity Lag</div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-2 w-full text-muted-foreground hover:text-destructive hover:bg-white/5 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-6 w-6" />
            </button>
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
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors outline-none group">
                  <Bell className={cn("h-5 w-5", unreadCount > 0 && "animate-[bell-swing_2s_infinite_ease-in-out]")} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 bg-destructive rounded-full border border-background text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] border-white/10 bg-sidebar/95 backdrop-blur-md">
                <DropdownMenuLabel className="font-heading uppercase tracking-widest text-[10px] text-muted-foreground">Recent Intel Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="max-h-[300px] overflow-auto scrollbar-hide">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[10px] text-muted-foreground uppercase font-mono">No active protocols</div>
                  ) : (
                    notifications.map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        onClick={() => markReadMutation.mutate(notif.id)}
                        className={cn(
                          "flex flex-col items-start gap-1 p-3 focus:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors",
                          notif.isRead === "false" && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            notif.type === "alert" ? "bg-destructive" :
                              notif.type === "success" ? "bg-primary" :
                                notif.type === "warning" ? "bg-orange-500" : "bg-blue-500",
                            notif.isRead === "false" && "animate-pulse"
                          )} />
                          <span className={cn("text-xs leading-tight transition-colors", notif.isRead === "false" ? "text-foreground font-bold" : "text-muted-foreground")}>
                            {notif.message}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground/60 uppercase font-mono ml-3.5">
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <Link href="/notifications">
                  <DropdownMenuItem className="justify-center text-xs text-primary font-bold uppercase tracking-wider py-2 cursor-pointer focus:bg-primary/10">
                    View All Protocols
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-extrabold text-xs shadow-[0_0_15px_rgba(38,217,98,0.2)] hover:scale-105 transition-transform outline-none">
                  {user.avatar}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-white/10 bg-sidebar/95 backdrop-blur-md">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="text-sm font-bold">{user.name}</span>
                  <div className="flex flex-col gap-1.5 mt-0.5">
                    <Badge variant="outline" className="w-fit text-[9px] h-4 uppercase tracking-tighter border-primary/30 text-primary bg-primary/5">{user.role} ACCESS</Badge>
                    <div className="flex items-center gap-1.5 text-[7px] font-mono text-muted-foreground/50 border border-white/5 bg-black/20 px-1.5 py-0.5 rounded">
                      <Lock className="h-2 w-2" />
                      <span className="truncate">{user.securityKey}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <Link href="/profile">
                  <DropdownMenuItem className="gap-3 py-3 focus:bg-white/10 cursor-pointer">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Account Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="gap-3 py-3 focus:bg-white/10 cursor-pointer">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span>Security Keys</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={logout}
                  className="gap-3 py-3 focus:bg-destructive/10 text-destructive font-semibold cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Terminate Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}