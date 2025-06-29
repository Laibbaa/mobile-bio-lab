import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  TestTubes, 
  BookOpen, 
  FileText, 
  Users, 
  Settings, 
  Calendar,
  QrCode,
  Bluetooth,
  ChartBar,
  Microscope
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

function SidebarLink({ href, icon: Icon, children, className }: SidebarLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <a
        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        } ${className || ""}`}
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </a>
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">Mobile Bio Lab</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {/* Dashboard */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Dashboard
              </h3>
              <ul className="space-y-2">
                <li>
                  <SidebarLink href="/" icon={Home}>
                    Overview
                  </SidebarLink>
                </li>
              </ul>
            </div>

            {/* Lab Management */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Lab Management
              </h3>
              <ul className="space-y-2">
                <li>
                  <SidebarLink href="/samples" icon={TestTubes}>
                    Sample Entry
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink href="/lab-scheduling" icon={Calendar}>
                    Lab Scheduling
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
      </aside>
    </div>
  );
}