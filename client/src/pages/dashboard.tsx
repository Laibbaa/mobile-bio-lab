import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import SampleChart from "@/components/dashboard/sample-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import SampleForm from "@/components/forms/sample-form";
import ProtocolLibrary from "@/components/protocols/protocol-library";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Dashboard Header */}
          <div className="bg-white border-b border-border">
            <div className="px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {user?.firstName}!
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Here's what's happening in your lab today
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    New Sample
                  </Button>
                  <Button variant="secondary" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Lab
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats Cards */}
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sample Data Chart */}
              <SampleChart />
              
              {/* Recent Activity */}
              <RecentActivity />
            </div>

            {/* Sample Submission Form */}
            <SampleForm />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Protocol Library */}
              <div className="lg:col-span-2">
                <ProtocolLibrary />
              </div>

              {/* System Status */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">System Status</h3>
                
                <div className="space-y-4">
                  {/* Mobile Lab Status */}
                  <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Mobile Lab #1</span>
                    </div>
                    <span className="text-xs text-success font-medium">Online</span>
                  </div>

                  {/* Sensor Connectivity */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Connected Sensors</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Temperature Sensor</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-success text-xs">Connected</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">pH Meter</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-success text-xs">Connected</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Conductivity Meter</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-warning rounded-full"></div>
                          <span className="text-warning text-xs">Reconnecting</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm"
                        size="sm"
                      >
                        <i className="fas fa-sync mr-2 text-xs"></i>
                        Refresh Sensors
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm"
                        size="sm"
                      >
                        <i className="fas fa-download mr-2 text-xs"></i>
                        Export Data
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm"
                        size="sm"
                      >
                        <i className="fas fa-share mr-2 text-xs"></i>
                        Share Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
