import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import IntelFeed from "@/pages/intel-feed";
import SubmitResearch from "@/pages/submit";
import Profile from "@/pages/profile";
import Mission from "@/pages/mission";
import MissionEngine from "@/pages/missions";
import AuthPage from "@/pages/auth";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminReview from "@/pages/admin/review";
import IntelligenceRegistry from "@/pages/admin/registry";
import ResearcherManagement from "@/pages/admin/researchers";
import EnterpriseManagement from "@/pages/admin/enterprises";
import ComplianceMonitor from "@/pages/admin/compliance";
import EvidenceStore from "@/pages/admin/logs";
import ThreatSignalGraph from "@/pages/admin/graph";
import PoliceDashboard from "@/pages/police/dashboard";
import PoliceCaseAnalysis from "@/pages/police/case-analysis";
import EvidenceVault from "@/pages/police/evidence-store";
import LandingPage from "@/pages/landing";
import PitchPage from "@/pages/pitch";
import SharedHome from "@/pages/home";
import ResearchActivity from "@/pages/researcher/activity";
import TechnicalCase from "@/pages/technical-case";
import WazuhDashboard from "@/pages/wazuh";
import GlobalLedger from "@/pages/ledger";
import CDOC from "@/pages/cdoc";
import NotificationsPage from "@/pages/notifications";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/auth-context";

// Protected Route Component
function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType, allowedRoles?: string[] }) {
  const { user } = useAuth();

  if (!user) return <Redirect to="/auth" />;
  if (allowedRoles && !allowedRoles.includes(user.role!)) return <Redirect to="/home" />;

  return <Component />;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      {/* Public Routes (Standalone) */}
      <Route path="/" component={LandingPage} />
      <Route path="/pitch" component={PitchPage} />
      <Route path="/auth" component={AuthPage} />

      {/* All other platform routes wrapped in Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/home">
              {!user ? <Redirect to="/auth" /> : <SharedHome />}
            </Route>
            <Route path="/dashboard">
              {!user ? <Redirect to="/auth" /> : (user.role === 'admin' ? <AdminDashboard /> : <Dashboard />)}
            </Route>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/mission" component={Mission} />
            <Route path="/missions" component={MissionEngine} />
            <Route path="/intel" component={IntelFeed} />
            <Route path="/activity" component={ResearchActivity} />
            <Route path="/submit" component={SubmitResearch} />
            <Route path="/profile" component={Profile} />
            <Route path="/admin/review">
              <ProtectedRoute component={AdminReview} allowedRoles={['admin']} />
            </Route>
            <Route path="/admin/registry">
              <ProtectedRoute component={IntelligenceRegistry} allowedRoles={['admin']} />
            </Route>
            <Route path="/admin/researchers">
              <ProtectedRoute component={ResearcherManagement} allowedRoles={['admin']} />
            </Route>
            <Route path="/admin/enterprises">
              <ProtectedRoute component={EnterpriseManagement} allowedRoles={['admin']} />
            </Route>
            <Route path="/enterprise/infrastructure">
              <ProtectedRoute component={WazuhDashboard} allowedRoles={['enterprise', 'admin']} />
            </Route>
            <Route path="/admin/compliance">
              <ProtectedRoute component={ComplianceMonitor} allowedRoles={['admin', 'enterprise']} />
            </Route>
            <Route path="/admin/logs">
              <ProtectedRoute component={EvidenceStore} allowedRoles={['admin']} />
            </Route>
            <Route path="/admin/graph">
              <ProtectedRoute component={ThreatSignalGraph} allowedRoles={['admin']} />
            </Route>
            <Route path="/police">
              <ProtectedRoute component={PoliceDashboard} allowedRoles={['police', 'admin']} />
            </Route>
            <Route path="/police/analysis/:id?">
              <ProtectedRoute component={PoliceCaseAnalysis} allowedRoles={['police', 'admin']} />
            </Route>
            <Route path="/police/evidence/:id?">
              <ProtectedRoute component={EvidenceVault} allowedRoles={['police', 'admin']} />
            </Route>
            <Route path="/technical-case" component={TechnicalCase} />
            <Route path="/ledger" component={GlobalLedger} />
            <Route path="/cdoc" component={CDOC} />
            <Route path="/notifications" component={NotificationsPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <SonnerToaster richColors position="top-right" theme="dark" closeButton />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;