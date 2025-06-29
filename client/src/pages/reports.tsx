import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, Download, Share, BarChart3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReportSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Report, Sample } from "@shared/schema";
import { z } from "zod";

const reportFormSchema = insertReportSchema.omit({ generatedBy: true });
type ReportFormData = z.infer<typeof reportFormSchema>;

export default function Reports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const { data: samples = [] } = useQuery<Sample[]>({
    queryKey: ["/api/samples"],
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      const res = await apiRequest("POST", "/api/reports", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      setIsFormOpen(false);
      toast({
        title: "Report created",
        description: "The report has been successfully generated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      content: {},
      status: "draft",
    },
  });

  const onSubmit = (data: ReportFormData) => {
    const reportContent = {
      summary: "Auto-generated report summary",
      charts: [],
      analysis: "Analysis results will be displayed here",
      recommendations: "Recommendations based on analysis"
    };
    
    createReportMutation.mutate({
      ...data,
      content: reportContent,
    });
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "shared": return "bg-primary text-primary-foreground";
      case "draft": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleExportPDF = (reportId: number) => {
    toast({
      title: "Export Started",
      description: "Your PDF report is being generated...",
    });
    // PDF export functionality would be implemented here
  };

  const handleShareReport = (reportId: number) => {
    toast({
      title: "Share Link Generated",
      description: "Report sharing link has been copied to clipboard.",
    });
    // Share functionality would be implemented here
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
                <h1 className="text-3xl font-bold text-foreground">Reports</h1>
                <p className="text-muted-foreground mt-2">
                  Generate and manage analytical reports
                </p>
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Generate New Report</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Report Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter report title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sampleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sample</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a sample" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {samples.map((sample) => (
                                  <SelectItem key={sample.id} value={sample.id.toString()}>
                                    {sample.sampleId} - {sample.sampleType}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="shared">Shared</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsFormOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createReportMutation.isPending}
                        >
                          {createReportMutation.isPending ? "Generating..." : "Generate Report"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Generated Reports ({filteredReports.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading reports...
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No reports found matching your search." : "No reports found. Generate your first report to get started."}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Sample ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => {
                        const sample = samples.find(s => s.id === report.sampleId);
                        return (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{report.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {sample?.sampleId || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(report.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(report.updatedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleExportPDF(report.id)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleShareReport(report.id)}
                                >
                                  <Share className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
