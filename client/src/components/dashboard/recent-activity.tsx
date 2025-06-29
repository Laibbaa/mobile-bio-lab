import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, CheckCircle, UserPlus, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Sample, Report } from "@shared/schema";

interface ActivityItem {
  id: string;
  type: "sample" | "report" | "user" | "schedule";
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export default function RecentActivity() {
  const { data: samples = [] } = useQuery<Sample[]>({
    queryKey: ["/api/samples"],
  });

  const { data: reports = [] } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  // Generate activity items from samples and reports
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Add recent samples
    const recentSamples = samples
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    recentSamples.forEach(sample => {
      activities.push({
        id: `sample-${sample.id}`,
        type: "sample",
        title: `Sample ${sample.sampleId}`,
        description: `${sample.sampleType.replace("_", " ")} sample collected`,
        timestamp: new Date(sample.createdAt),
        icon: FlaskConical,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      });
    });

    // Add recent reports
    const recentReports = reports
      .filter(report => report.status === "completed")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 2);

    recentReports.forEach(report => {
      activities.push({
        id: `report-${report.id}`,
        type: "report",
        title: report.title,
        description: "Analysis report completed",
        timestamp: new Date(report.updatedAt),
        icon: CheckCircle,
        iconBg: "bg-success/10",
        iconColor: "text-success",
      });
    });

    // Sort all activities by timestamp and return top 5
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  };

  const activities = generateActivities();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Recent Activity
          </CardTitle>
          <Link href="/samples">
            <Button variant="ghost" size="sm" className="text-primary hover:underline">
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No recent activity</p>
              <p className="text-sm">Start by collecting your first sample</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.iconBg}`}>
                    <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.title}</span>{" "}
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
