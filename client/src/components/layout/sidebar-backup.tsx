import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Calendar, 
  FlaskConical, 
  QrCode, 
  Bluetooth, 
  ChartBar, 
  FileText, 
  BookOpen, 
  Users, 
  Settings 
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

function SidebarLink({ href, icon: Icon, children, className }: SidebarLinkProps) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));

  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "text-primary bg-primary/10" 
          : "text-foreground hover:text-primary hover:bg-accent/50",
        className
      )}>
        <Icon className="mr-3 h-4 w-4" />
        {children}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-border">
      <div className="p-6">
        <div className="space-y-6">
          {/* Overview Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Overview
            </h3>
            <ul className="space-y-2">
              <li>
                <SidebarLink href="/" icon={BarChart3}>
                  Dashboard
                </SidebarLink>
              </li>
              <li>
                <SidebarLink href="/lab-scheduling" icon={Calendar}>
                  Lab Scheduling
                </SidebarLink>
              </li>
            </ul>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Data Management
            </h3>
            <ul className="space-y-2">
              <li>
                <SidebarLink href="/samples" icon={FlaskConical}>
                  Sample Collection
                </SidebarLink>
              </li>
              <li>
                <SidebarLink href="/qr-scanner" icon={QrCode}>
                  QR Scanner
                </SidebarLink>
              </li>
              <li>
                <SidebarLink href="/sensor-data" icon={Bluetooth}>
                  Sensor Data
                </SidebarLink>
              </li>
            </ul>
          </div>

          {/* Analysis */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Analysis
            </h3>
            <ul className="space-y-2">
              <li>
                <SidebarLink href="/data-visualization" icon={ChartBar}>
                  Data Visualization
                </SidebarLink>
              </li>
              <li>
                <SidebarLink href="/reports" icon={FileText}>
                  Generate Reports
                </SidebarLink>
              </li>
              <li>
                <SidebarLink href="/protocols" icon={BookOpen}>
                  Protocols
                </SidebarLink>
              </li>
            </ul>
          </div>

          {/* Admin Section - Only show for admin users */}
          {user?.role === "admin" && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Administration
              </h3>
              <ul className="space-y-2">
                <li>
                  <SidebarLink href="/admin" icon={Settings}>
                    Admin Dashboard
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink href="/admin/users" icon={Users}>
                    User Management
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink href="/admin/protocols" icon={BookOpen}>
                    Protocol Management
                  </SidebarLink>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
