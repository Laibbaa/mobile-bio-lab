import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Camera, Search, Package, CheckCircle, AlertCircle } from "lucide-react";

interface ScannedSample {
  id: string;
  sampleId: string;
  sampleType: string;
  collectionDate: string;
  location: string;
  status: "pending" | "processing" | "completed";
  qrCode: string;
}

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scannedResult, setScannedResult] = useState<ScannedSample | null>(null);
  const [scanHistory, setScanHistory] = useState<ScannedSample[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock sample data that could be retrieved via QR code
  const mockSamples: Record<string, ScannedSample> = {
    "BIO-2025-001": {
      id: "1",
      sampleId: "BIO-2025-001",
      sampleType: "water",
      collectionDate: "2025-06-25",
      location: "Lake Michigan - North Shore",
      status: "pending",
      qrCode: "BIO-2025-001",
    },
    "BIO-2025-002": {
      id: "2",
      sampleId: "BIO-2025-002",
      sampleType: "soil",
      collectionDate: "2025-06-24",
      location: "Research Field Site A",
      status: "processing",
      qrCode: "BIO-2025-002",
    },
    "BIO-2025-003": {
      id: "3",
      sampleId: "BIO-2025-003",
      sampleType: "biological_fluid",
      collectionDate: "2025-06-23",
      location: "Lab Room B",
      status: "completed",
      qrCode: "BIO-2025-003",
    },
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      
      // Simulate QR code detection after 3 seconds
      setTimeout(() => {
        simulateQRDetection("BIO-2025-001");
      }, 3000);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Fallback: simulate camera access for demo
      setIsScanning(true);
      if (videoRef.current) {
        // Create a placeholder for camera view
        videoRef.current.style.background = "linear-gradient(45deg, #f0f0f0, #e0e0e0)";
      }
      
      setTimeout(() => {
        simulateQRDetection("BIO-2025-001");
      }, 3000);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateQRDetection = (qrCode: string) => {
    const sample = mockSamples[qrCode];
    if (sample) {
      setScannedResult(sample);
      setScanHistory(prev => [sample, ...prev.slice(0, 9)]); // Keep last 10 scans
      stopScanning();
    }
  };

  const handleManualSearch = () => {
    if (manualInput.trim()) {
      const sample = mockSamples[manualInput.trim()];
      if (sample) {
        setScannedResult(sample);
        setScanHistory(prev => [sample, ...prev.slice(0, 9)]);
      } else {
        setScannedResult(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code Scanner</h1>
        <p className="text-muted-foreground">
          Scan sample QR codes to quickly access sample information and tracking data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Use your camera to scan sample QR codes or enter codes manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera View */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {isScanning ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-primary border-dashed rounded-lg animate-pulse">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-primary font-medium">Scanning...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Camera className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">Camera view will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scanner Controls */}
            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="outline" className="flex-1">
                  Stop Scanning
                </Button>
              )}
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <Label htmlFor="manual-input">Manual Code Entry</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-input"
                  placeholder="Enter QR code (e.g., BIO-2025-001)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <Button onClick={handleManualSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>
              Sample information retrieved from QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scannedResult ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully found sample: {scannedResult.sampleId}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{scannedResult.sampleId}</h3>
                    <Badge className={getStatusColor(scannedResult.status)}>
                      {getStatusIcon(scannedResult.status)}
                      <span className="ml-1 capitalize">{scannedResult.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sample Type</p>
                      <p className="font-medium capitalize">{scannedResult.sampleType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Collection Date</p>
                      <p className="font-medium">{scannedResult.collectionDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{scannedResult.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      View Full Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <QrCode className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Scan a QR code or enter a sample ID to view results</p>
                <p className="text-sm mt-1">Try: BIO-2025-001, BIO-2025-002, or BIO-2025-003</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Previously scanned samples</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((sample, index) => (
                <div
                  key={`${sample.id}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setScannedResult(sample)}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{sample.sampleId}</p>
                      <p className="text-sm text-muted-foreground">{sample.location}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(sample.status)} variant="secondary">
                    {sample.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}