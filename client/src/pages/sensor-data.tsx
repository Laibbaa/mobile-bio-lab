import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  Activity, 
  Bluetooth, 
  Wifi, 
  AlertTriangle,
  RefreshCw,
  Settings,
  Battery
} from "lucide-react";

interface SensorReading {
  timestamp: string;
  temperature: number;
  ph: number;
  conductivity: number;
  dissolved_oxygen: number;
  turbidity: number;
}

interface SensorDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  batteryLevel: number;
  lastReading: string;
  status: "active" | "inactive" | "error";
}

export default function SensorData() {
  const [selectedSensor, setSelectedSensor] = useState<string>("temp-001");
  const [isConnecting, setIsConnecting] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock sensor devices
  const [sensors] = useState<SensorDevice[]>([
    {
      id: "temp-001",
      name: "Temperature Probe A",
      type: "Temperature",
      connected: true,
      batteryLevel: 85,
      lastReading: "2 seconds ago",
      status: "active",
    },
    {
      id: "ph-001",
      name: "pH Meter B",
      type: "pH",
      connected: true,
      batteryLevel: 62,
      lastReading: "5 seconds ago",
      status: "active",
    },
    {
      id: "cond-001",
      name: "Conductivity Sensor",
      type: "Conductivity",
      connected: false,
      batteryLevel: 23,
      lastReading: "2 minutes ago",
      status: "inactive",
    },
    {
      id: "do-001",
      name: "Dissolved O₂ Sensor",
      type: "Dissolved Oxygen",
      connected: true,
      batteryLevel: 78,
      lastReading: "1 second ago",
      status: "active",
    },
  ]);

  // Mock real-time sensor data
  const [sensorData, setSensorData] = useState<SensorReading[]>([
    { timestamp: "12:00", temperature: 22.5, ph: 7.2, conductivity: 450, dissolved_oxygen: 8.5, turbidity: 2.1 },
    { timestamp: "12:05", temperature: 22.8, ph: 7.1, conductivity: 455, dissolved_oxygen: 8.3, turbidity: 2.3 },
    { timestamp: "12:10", temperature: 23.1, ph: 7.0, conductivity: 460, dissolved_oxygen: 8.1, turbidity: 2.2 },
    { timestamp: "12:15", temperature: 23.4, ph: 6.9, conductivity: 465, dissolved_oxygen: 7.9, turbidity: 2.4 },
    { timestamp: "12:20", temperature: 23.2, ph: 7.0, conductivity: 462, dissolved_oxygen: 8.0, turbidity: 2.3 },
    { timestamp: "12:25", temperature: 22.9, ph: 7.1, conductivity: 458, dissolved_oxygen: 8.2, turbidity: 2.1 },
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newReading: SensorReading = {
        timestamp: timeStr,
        temperature: 22 + Math.random() * 3,
        ph: 6.8 + Math.random() * 0.6,
        conductivity: 440 + Math.random() * 40,
        dissolved_oxygen: 7.5 + Math.random() * 1.5,
        turbidity: 1.8 + Math.random() * 0.8,
      };

      setSensorData(prev => [...prev.slice(-9), newReading]);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const connectSensor = async (sensorId: string) => {
    setIsConnecting(true);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    console.log(`Connecting to sensor: ${sensorId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string, connected: boolean) => {
    if (connected) {
      return <Bluetooth className="h-4 w-4 text-blue-500" />;
    }
    return <Wifi className="h-4 w-4 text-gray-400" />;
  };

  const currentReading = sensorData[sensorData.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sensor Data</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and data collection from Bluetooth sensors
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Current Readings Overview */}
      {currentReading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-2xl font-bold">{currentReading.temperature.toFixed(1)}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">pH Level</p>
                  <p className="text-2xl font-bold">{currentReading.ph.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Conductivity</p>
                  <p className="text-2xl font-bold">{Math.round(currentReading.conductivity)}</p>
                  <p className="text-xs text-muted-foreground">μS/cm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Dissolved O₂</p>
                  <p className="text-2xl font-bold">{currentReading.dissolved_oxygen.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">mg/L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Turbidity</p>
                  <p className="text-2xl font-bold">{currentReading.turbidity.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">NTU</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Sensors</CardTitle>
            <CardDescription>Bluetooth sensor devices status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sensors.map((sensor) => (
              <div key={sensor.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(sensor.status, sensor.connected)}
                    <div>
                      <p className="font-medium text-sm">{sensor.name}</p>
                      <p className="text-xs text-muted-foreground">{sensor.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(sensor.status)} variant="secondary">
                    {sensor.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Battery</span>
                    <span>{sensor.batteryLevel}%</span>
                  </div>
                  <Progress value={sensor.batteryLevel} className="h-2" />
                  {sensor.batteryLevel < 30 && (
                    <Alert className="py-2">
                      <AlertTriangle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        Low battery warning
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last reading: {sensor.lastReading}</span>
                  {!sensor.connected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => connectSensor(sensor.id)}
                      disabled={isConnecting}
                      className="h-6 px-2 text-xs"
                    >
                      {isConnecting ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Charts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Real-time Data</CardTitle>
            <CardDescription>Live sensor readings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Temperature Chart */}
              <div>
                <h4 className="text-sm font-medium mb-2">Temperature (°C)</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* pH Chart */}
              <div>
                <h4 className="text-sm font-medium mb-2">pH Level</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[6.5, 7.5]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="ph" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Conductivity Chart */}
              <div>
                <h4 className="text-sm font-medium mb-2">Conductivity (μS/cm)</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="conductivity" 
                      stroke="#eab308" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}