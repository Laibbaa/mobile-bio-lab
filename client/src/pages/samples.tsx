import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Filter, QrCode, Bluetooth } from "lucide-react";
import SampleForm from "@/components/forms/sample-form";
import type { Sample } from "@shared/schema";

export default function Samples() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: samples = [], isLoading } = useQuery<Sample[]>({
    queryKey: ["/api/samples"],
  });

  const filteredSamples = samples.filter(sample =>
    sample.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sample.sampleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sample.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "processing": return "bg-warning text-warning-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSampleTypeIcon = (type: string) => {
    switch (type) {
      case "water": return "💧";
      case "soil": return "🌱";
      case "plant": return "🌿";
      case "biological_fluid": return "🧪";
      case "air": return "💨";
      default: return "🔬";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Samples</h1>
                <p className="text-muted-foreground mt-2">
                  Manage and track your biological samples
                </p>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR Code
                </Button>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      New Sample
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Sample</DialogTitle>
                    </DialogHeader>
                    <SampleForm onSuccess={() => setIsFormOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Search and Filter */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search samples by ID, type, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Bluetooth className="h-4 w-4 mr-2" />
                    Sync Sensors
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Samples Table */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Collection ({filteredSamples.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading samples...
                  </div>
                ) : filteredSamples.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No samples found matching your search." : "No samples found. Create your first sample to get started."}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sample ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Collection Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Temperature</TableHead>
                        <TableHead>pH</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSamples.map((sample) => (
                        <TableRow key={sample.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getSampleTypeIcon(sample.sampleType)}
                              </span>
                              <span>{sample.sampleId}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {sample.sampleType.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(sample.collectionDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{sample.location || "N/A"}</TableCell>
                          <TableCell>
                            {sample.temperature ? `${sample.temperature}°C` : "N/A"}
                          </TableCell>
                          <TableCell>
                            {sample.ph ? sample.ph : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(sample.status)}>
                              {sample.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
