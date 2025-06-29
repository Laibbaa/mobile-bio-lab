import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, FileText, Tag, Clock, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import type { Protocol } from "@shared/schema";

const protocolFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["water_analysis", "soil_testing", "plant_biology", "microbiology", "chemistry"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedTime: z.string().min(1, "Estimated time is required"),
  equipment: z.string().min(1, "Equipment list is required"),
  materials: z.string().min(1, "Materials list is required"),
  safetyNotes: z.string().optional(),
  steps: z.string().min(1, "Steps are required"),
  tags: z.string().optional(),
});

type ProtocolFormData = z.infer<typeof protocolFormSchema>;

export default function AdminProtocols() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: protocols = [], isLoading } = useQuery<Protocol[]>({
    queryKey: ["/api/admin/protocols"],
  });

  const form = useForm<ProtocolFormData>({
    resolver: zodResolver(protocolFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "water_analysis",
      difficulty: "beginner",
      estimatedTime: "",
      equipment: "",
      materials: "",
      safetyNotes: "",
      steps: "",
      tags: "",
    },
  });

  const createProtocolMutation = useMutation({
    mutationFn: async (data: ProtocolFormData) => {
      const res = await apiRequest("POST", "/api/protocols", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/protocols"] });
      queryClient.invalidateQueries({ queryKey: ["/api/protocols"] });
      toast({
        title: "Protocol created",
        description: "The protocol has been successfully created.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProtocolMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProtocolFormData }) => {
      const res = await apiRequest("PUT", `/api/protocols/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/protocols"] });
      queryClient.invalidateQueries({ queryKey: ["/api/protocols"] });
      toast({
        title: "Protocol updated",
        description: "The protocol has been successfully updated.",
      });
      setIsDialogOpen(false);
      setEditingProtocol(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProtocolMutation = useMutation({
    mutationFn: async (protocolId: number) => {
      await apiRequest("DELETE", `/api/admin/protocols/${protocolId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/protocols"] });
      queryClient.invalidateQueries({ queryKey: ["/api/protocols"] });
      toast({
        title: "Protocol deleted",
        description: "The protocol has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (protocol: Protocol) => {
    setEditingProtocol(protocol);
    form.reset({
      title: protocol.title,
      description: protocol.description,
      category: protocol.category as any,
      difficulty: protocol.difficulty as any,
      estimatedTime: protocol.estimatedTime,
      equipment: protocol.equipment,
      materials: protocol.materials,
      safetyNotes: protocol.safetyNotes || "",
      steps: protocol.steps,
      tags: protocol.tags || "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProtocolFormData) => {
    if (editingProtocol) {
      updateProtocolMutation.mutate({ id: editingProtocol.id, data });
    } else {
      createProtocolMutation.mutate(data);
    }
  };

  const filteredProtocols = protocols.filter((protocol) => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || protocol.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "water_analysis": return "default";
      case "soil_testing": return "secondary";
      case "plant_biology": return "outline";
      case "microbiology": return "destructive";
      case "chemistry": return "default";
      default: return "outline";
    }
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "default";
      case "intermediate": return "secondary";
      case "advanced": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Protocol Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage laboratory protocols and procedures
              </p>
            </div>

            <Tabs defaultValue="protocols" className="space-y-4">
              <TabsList>
                <TabsTrigger value="protocols">All Protocols</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="protocols" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Protocol Library</CardTitle>
                        <CardDescription>
                          Create and manage laboratory protocols
                        </CardDescription>
                      </div>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => {
                            setEditingProtocol(null);
                            form.reset();
                          }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Protocol
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {editingProtocol ? "Edit Protocol" : "Create New Protocol"}
                            </DialogTitle>
                            <DialogDescription>
                              {editingProtocol ? "Update the protocol details below." : "Fill in the details to create a new laboratory protocol."}
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Title</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Protocol title" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="category"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Category</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="water_analysis">Water Analysis</SelectItem>
                                          <SelectItem value="soil_testing">Soil Testing</SelectItem>
                                          <SelectItem value="plant_biology">Plant Biology</SelectItem>
                                          <SelectItem value="microbiology">Microbiology</SelectItem>
                                          <SelectItem value="chemistry">Chemistry</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="difficulty"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Difficulty</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="beginner">Beginner</SelectItem>
                                          <SelectItem value="intermediate">Intermediate</SelectItem>
                                          <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="estimatedTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Estimated Time</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., 2 hours" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Brief description of the protocol"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="equipment"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Equipment Required</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="List required equipment (one per line)"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="materials"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Materials Required</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="List required materials (one per line)"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name="safetyNotes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Safety Notes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Important safety considerations"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="steps"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Procedure Steps</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Detailed step-by-step instructions"
                                        className="min-h-[120px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tags (Optional)</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Comma-separated tags"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex justify-end space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={createProtocolMutation.isPending || updateProtocolMutation.isPending}
                                >
                                  {editingProtocol ? "Update" : "Create"} Protocol
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filter */}
                    <div className="flex space-x-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search protocols..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="water_analysis">Water Analysis</SelectItem>
                          <SelectItem value="soil_testing">Soil Testing</SelectItem>
                          <SelectItem value="plant_biology">Plant Biology</SelectItem>
                          <SelectItem value="microbiology">Microbiology</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Protocols Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProtocols.map((protocol) => (
                          <TableRow key={protocol.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{protocol.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {protocol.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getCategoryBadgeVariant(protocol.category)}>
                                {protocol.category.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getDifficultyBadgeVariant(protocol.difficulty)}>
                                {protocol.difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              {protocol.estimatedTime}
                            </TableCell>
                            <TableCell>
                              {new Date(protocol.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(protocol)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Protocol</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{protocol.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteProtocolMutation.mutate(protocol.id)}
                                        className="bg-destructive text-destructive-foreground"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Water Analysis", key: "water_analysis", count: protocols.filter(p => p.category === "water_analysis").length },
                    { name: "Soil Testing", key: "soil_testing", count: protocols.filter(p => p.category === "soil_testing").length },
                    { name: "Plant Biology", key: "plant_biology", count: protocols.filter(p => p.category === "plant_biology").length },
                    { name: "Microbiology", key: "microbiology", count: protocols.filter(p => p.category === "microbiology").length },
                    { name: "Chemistry", key: "chemistry", count: protocols.filter(p => p.category === "chemistry").length },
                  ].map((category) => (
                    <Card key={category.key}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <Badge>{category.count}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {category.count} protocols available in this category
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Protocol Usage</CardTitle>
                      <CardDescription>Most frequently accessed protocols</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Usage analytics coming soon
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Category Distribution</CardTitle>
                      <CardDescription>Protocols by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { name: "Water Analysis", count: protocols.filter(p => p.category === "water_analysis").length },
                          { name: "Soil Testing", count: protocols.filter(p => p.category === "soil_testing").length },
                          { name: "Plant Biology", count: protocols.filter(p => p.category === "plant_biology").length },
                          { name: "Microbiology", count: protocols.filter(p => p.category === "microbiology").length },
                          { name: "Chemistry", count: protocols.filter(p => p.category === "chemistry").length },
                        ].map((item) => (
                          <div key={item.name} className="flex justify-between items-center">
                            <span className="text-sm">{item.name}</span>
                            <span className="text-sm font-medium">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}