import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Users, FileText, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalSamples: number;
  activeUsers: number;
  pendingReports: number;
  completedSamples: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-muted w-12 h-12"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="mt-4 h-4 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Samples",
      value: stats?.totalSamples || 0,
      icon: FlaskConical,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      change: "+12%",
      changeText: "from last month",
      changeColor: "text-success",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: Users,
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
      change: "+5",
      changeText: "new this week",
      changeColor: "text-success",
    },
    {
      title: "Pending Reports",
      value: stats?.pendingReports || 0,
      icon: FileText,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      change: "3 urgent",
      changeText: "require attention",
      changeColor: "text-warning",
    },
    {
      title: "Lab Utilization",
      value: `${Math.round((stats?.completedSamples || 0) / Math.max(stats?.totalSamples || 1, 1) * 100)}%`,
      icon: TrendingUp,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      change: "",
      changeText: "",
      changeColor: "",
      showProgress: true,
      progressValue: Math.round((stats?.completedSamples || 0) / Math.max(stats?.totalSamples || 1, 1) * 100),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="mt-4">
              {stat.showProgress ? (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stat.progressValue}%` }}
                  ></div>
                </div>
              ) : (
                <div className="flex items-center text-sm">
                  <span className={`font-medium ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                  {stat.changeText && (
                    <span className="text-muted-foreground ml-2">
                      {stat.changeText}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
