import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Shield,
    Activity,
    Radio,
    Database,
    Lock,
    Target,
    Zap,
    FileText,
    LayoutDashboard,
    Search,
    Globe,
    Terminal,
    Bell
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useLocation } from "wouter";
import { toast } from "sonner";

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const [, setLocation] = useLocation();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search intelligence..." />
            <CommandList className="bg-sidebar/95 backdrop-blur-xl border-white/5">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Quick Access">
                    <CommandItem onSelect={() => runCommand(() => setLocation("/"))}>
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                        <span>Platform Home</span>
                        <CommandShortcut>⌘H</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setLocation("/intel"))}>
                        <Activity className="mr-2 h-4 w-4 text-primary" />
                        <span>Intel Feed</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setLocation("/cdoc"))}>
                        <Radio className="mr-2 h-4 w-4 text-red-500" />
                        <span>War Room (CDOC)</span>
                        <CommandShortcut>⌘W</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setLocation("/notifications"))}>
                        <Bell className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Protocol History</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Operations">
                    <CommandItem onSelect={() => runCommand(() => setLocation("/dashboard"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>System Dashboard</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setLocation("/ledger"))}>
                        <Database className="mr-2 h-4 w-4 text-orange-400" />
                        <span>Global Ledger</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => {
                        toast.info("Initializing Deep Scan...", {
                            description: "Scanning all local vectors for anomalies."
                        });
                    })}>
                        <Search className="mr-2 h-4 w-4 text-primary" />
                        <span>Global Deep Scan</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="System">
                    <CommandItem onSelect={() => runCommand(() => setLocation("/profile"))}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile Credentials</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => {
                        toast.success("Security Protocols Updated", {
                            description: "Latest CVE signatures synchronized."
                        });
                    })}>
                        <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Sync CVE Signatures</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => {
                        window.print();
                    })}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Export Forensic Report</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
