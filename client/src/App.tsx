import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Samples from "@/pages/samples";
import Protocols from "@/pages/protocols";
import Reports from "@/pages/reports";
import AdminUsers from "@/pages/admin/users";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProtocols from "@/pages/admin/protocols";
import LabScheduling from "@/pages/lab-scheduling";
import QRScanner from "@/pages/qr-scanner";
import SensorData from "@/pages/sensor-data";
import DataVisualization from "@/pages/data-visualization";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/samples" component={Samples} />
      <ProtectedRoute path="/protocols" component={Protocols} />
      <ProtectedRoute path="/reports" component={Reports} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/users" component={AdminUsers} />
      <ProtectedRoute path="/admin/protocols" component={AdminProtocols} />
      <ProtectedRoute path="/lab-scheduling" component={LabScheduling} />
      <ProtectedRoute path="/qr-scanner" component={QRScanner} />
      <ProtectedRoute path="/sensor-data" component={SensorData} />
      <ProtectedRoute path="/data-visualization" component={DataVisualization} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
