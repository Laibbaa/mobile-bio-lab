import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Download,
  Filter,
  TrendingUp,
  Database
} from "lucide-react";

interface DataPoint {
  date: string;
  temperature: number;
  ph: number;
  conductivity: number;
  dissolved_oxygen: number;
  turbidity: number;
  location: string;
  sampleType: string;
}

export default function DataVisualization() {
  const [selectedChart, setSelectedChart] = useState("line");
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  // Mock aggregated data
  const sampleData: DataPoint[] = [
    { date: "2025-06-19", temperature: 22.1, ph: 7.2, conductivity: 450, dissolved_oxygen: 8.5, turbidity: 2.1, location: "Lake Michigan", sampleType: "water" },
    { date: "2025-06-20", temperature: 22.8, ph: 7.1, conductivity: 455, dissolved_oxygen: 8.3, turbidity: 2.3, location: "Lake Michigan", sampleType: "water" },
    { date: "2025-06-21", temperature: 23.1, ph: 7.0, conductivity: 460, dissolved_oxygen: 8.1, turbidity: 2.2, location: "Research Field", sampleType: "soil" },
    { date: "2025-06-22", temperature: 23.4, ph: 6.9, conductivity: 465, dissolved_oxygen: 7.9, turbidity: 2.4, location: "Lab Room A", sampleType: "biological_fluid" },
    { date: "2025-06-23", temperature: 23.2, ph: 7.0, conductivity: 462, dissolved_oxygen: 8.0, turbidity: 2.3, location: "Lake Michigan", sampleType: "water" },
    { date: "2025-06-24", temperature: 22.9, ph: 7.1, conductivity: 458, dissolved_oxygen: 8.2, turbidity: 2.1, location: "Research Field", sampleType: "soil" },
    { date: "2025-06-25", temperature: 22.5, ph: 7.2, conductivity: 452, dissolved_oxygen: 8.4, turbidity: 2.0, location: "Lab Room B", sampleType: "air" },
  ];

  // Sample type distribution data
  const sampleTypeData = [
    { name: "Water", value: 45, color: "#3b82f6" },
    { name: "Soil", value: 25, color: "#8b5cf6" },
    { name: "Biological Fluid", value: 20, color: "#10b981" },
    { name: "Air", value: 10, color: "#f59e0b" },
  ];

  // Location-based data
  const locationData = [
    { location: "Lake Michigan", samples: 15, avgTemp: 22.3, avgPh: 7.1 },
    { location: "Research Field", samples: 12, avgTemp: 23.1, avgPh: 6.9 },
    { location: "Lab Room A", samples: 8, avgTemp: 23.5, avgPh: 7.0 },
    { location: "Lab Room B", samples: 6, avgTemp: 22.8, avgPh: 7.2 },
  ];

  // Correlation data
  const correlationData = sampleData.map(point => ({
    temperature: point.temperature,
    ph: point.ph,
    conductivity: point.conductivity,
    dissolved_oxygen: point.dissolved_oxygen,
  }));

  const getParameterUnit = (param: string) => {
    switch (param) {
      case "temperature":
        return "°C";
      case "ph":
        return "";
      case "conductivity":
        return "μS/cm";
      case "dissolved_oxygen":
        return "mg/L";
      case "turbidity":
        return "NTU";
      default:
        return "";
    }
  };

  const getParameterColor = (param: string) => {
    switch (param) {
      case "temperature":
        return "#ef4444";
      case "ph":
        return "#3b82f6";
      case "conductivity":
        return "#eab308";
      case "dissolved_oxygen":
        return "#10b981";
      case "turbidity":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Temperature,pH,Conductivity,Dissolved Oxygen,Turbidity,Location,Sample Type\n" +
      sampleData.map(row => 
        `${row.date},${row.temperature},${row.ph},${row.conductivity},${row.dissolved_oxygen},${row.turbidity},${row.location},${row.sampleType}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lab-data-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Visualization</h1>
          <p className="text-muted-foreground">
            Interactive charts and analytics for laboratory data analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={exportData} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visualization Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Parameter</label>
              <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="ph">pH Level</SelectItem>
                  <SelectItem value="conductivity">Conductivity</SelectItem>
                  <SelectItem value="dissolved_oxygen">Dissolved O₂</SelectItem>
                  <SelectItem value="turbidity">Turbidity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          {/* Main Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)} Trends
              </CardTitle>
              <CardDescription>
                {selectedParameter} measurements over time ({getParameterUnit(selectedParameter)})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {selectedChart === "line" && (
                  <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={selectedParameter}
                      stroke={getParameterColor(selectedParameter)}
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
                {selectedChart === "area" && (
                  <AreaChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey={selectedParameter}
                      stroke={getParameterColor(selectedParameter)}
                      fill={getParameterColor(selectedParameter)}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                )}
                {selectedChart === "bar" && (
                  <BarChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey={selectedParameter}
                      fill={getParameterColor(selectedParameter)}
                    />
                  </BarChart>
                )}
                {selectedChart === "scatter" && (
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="temperature" name="Temperature" />
                    <YAxis dataKey={selectedParameter} name={selectedParameter} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter
                      dataKey={selectedParameter}
                      fill={getParameterColor(selectedParameter)}
                    />
                  </ScatterChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sample Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Sample Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sampleTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sampleTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sample Count by Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="samples" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parameter Correlations</CardTitle>
              <CardDescription>
                Relationship between different measurement parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="temperature" name="Temperature (°C)" />
                    <YAxis dataKey="ph" name="pH" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="ph" fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="conductivity" name="Conductivity (μS/cm)" />
                    <YAxis dataKey="dissolved_oxygen" name="Dissolved O₂ (mg/L)" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="dissolved_oxygen" fill="#10b981" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total Samples</p>
                    <p className="text-2xl font-bold">{sampleData.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <LineChartIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Avg Temperature</p>
                    <p className="text-2xl font-bold">
                      {(sampleData.reduce((acc, d) => acc + d.temperature, 0) / sampleData.length).toFixed(1)}°C
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Avg pH</p>
                    <p className="text-2xl font-bold">
                      {(sampleData.reduce((acc, d) => acc + d.ph, 0) / sampleData.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Data Points</p>
                    <p className="text-2xl font-bold">{sampleData.length * 5}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Location Summary</CardTitle>
              <CardDescription>Statistical summary by collection location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationData.map((location) => (
                  <div key={location.location} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{location.location}</p>
                      <p className="text-sm text-muted-foreground">{location.samples} samples</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <Badge variant="outline">
                        Temp: {location.avgTemp}°C
                      </Badge>
                      <Badge variant="outline">
                        pH: {location.avgPh}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}