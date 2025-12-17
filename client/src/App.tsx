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
import AuthPage from "@/pages/auth";
import AdminReview from "@/pages/admin/review";
import { AuthProvider, useAuth } from "@/context/auth-context";

// Protected Route Component
function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType, allowedRoles?: string[] }) {
  const { user } = useAuth();
  
  if (!user) return <Redirect to="/auth" />;
  if (allowedRoles && !allowedRoles.includes(user.role!)) return <Redirect to="/" />;
  
  return <Component />;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/auth">
        {user ? <Redirect to="/" /> : <AuthPage />}
      </Route>
      
      {/* Wrap protected routes in Layout */}
      <Layout>
        <Switch>
          <Route path="/">
            {user ? <Dashboard /> : <Redirect to="/auth" />}
          </Route>
          <Route path="/mission" component={Mission}/>
          <Route path="/intel" component={IntelFeed}/>
          <Route path="/submit" component={SubmitResearch}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/admin/review">
            <ProtectedRoute component={AdminReview} allowedRoles={['admin']} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;