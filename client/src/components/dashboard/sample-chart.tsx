import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import type { Sample } from "@shared/schema";

export default function SampleChart() {
  const [timeRange, setTimeRange] = useState("7D");
  
  const { data: samples = [], isLoading } = useQuery<Sample[]>({
    queryKey: ["/api/samples"],
  });

  // Process data for the chart
  const processChartData = () => {
    const now = new Date();
    const days = timeRange === "7D" ? 7 : timeRange === "30D" ? 30 : 90;
    const chartData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { 
        weekday: timeRange === "7D" ? "short" : undefined,
        month: timeRange !== "7D" ? "short" : undefined,
        day: "numeric"
      });

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const samplesCollected = samples.filter(sample => {
        const sampleDate = new Date(sample.createdAt);
        return sampleDate >= dayStart && sampleDate <= dayEnd;
      }).length;

      const completedSamples = samples.filter(sample => {
        const sampleDate = new Date(sample.createdAt);
        return sampleDate >= dayStart && sampleDate <= dayEnd && sample.status === "completed";
      }).length;

      chartData.push({
        date: dateStr,
        samplesCollected,
        completedSamples,
      });
    }

    return chartData;
  };

  const chartData = processChartData();

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Sample Collection Trends
          </CardTitle>
          <div className="flex space-x-2">
            {["7D", "30D", "90D"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                className="px-3 py-1 text-sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="samplesCollected"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  name="Samples Collected"
                />
                <Line
                  type="monotone"
                  dataKey="completedSamples"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                  name="Completed Analysis"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
