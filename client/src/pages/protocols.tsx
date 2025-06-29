import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import ProtocolLibrary from "@/components/protocols/protocol-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, BookOpen, FlaskConical } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProtocolSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Protocol } from "@shared/schema";
import { z } from "zod";

const protocolFormSchema = insertProtocolSchema.omit({ createdBy: true });
type ProtocolFormData = z.infer<typeof protocolFormSchema>;

export default function Protocols() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: protocols = [], isLoading } = useQuery<Protocol[]>({
    queryKey: ["/api/protocols"],
  });

  const createProtocolMutation = useMutation({
    mutationFn: async (data: ProtocolFormData) => {
      const res = await apiRequest("POST", "/api/protocols", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/protocols"] });
      setIsFormOpen(false);
      toast({
        title: "Protocol created",
        description: "The protocol has been successfully created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating protocol",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<ProtocolFormData>({
    resolver: zodResolver(protocolFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      content: "",
      status: "active",
    },
  });

  const onSubmit = (data: ProtocolFormData) => {
    createProtocolMutation.mutate(data);
  };

  const filteredProtocols = protocols.filter(protocol =>
    protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "review": return "bg-warning text-warning-foreground";
      case "inactive": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "water": return "💧";
      case "soil": return "🌱";
      case "plant": return "🌿";
      case "biological": return "🧪";
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
                <h1 className="text-3xl font-bold text-foreground">Protocol Library</h1>
                <p className="text-muted-foreground mt-2">
                  Access and manage standard laboratory protocols
                </p>
              </div>
              {user?.role === "admin" && (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Protocol
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Protocol</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Water Analysis, Soil Testing" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Protocol Steps</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Step-by-step instructions..."
                                  className="min-h-[200px]"
                                  {...field} 
                                />
                              </FormControl>
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
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="review">Under Review</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
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
                            disabled={createProtocolMutation.isPending}
                          >
                            {createProtocolMutation.isPending ? "Creating..." : "Create Protocol"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Search */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search protocols by title, description, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Protocols Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Loading protocols...
                </div>
              ) : filteredProtocols.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {searchQuery ? "No protocols found matching your search." : "No protocols available."}
                </div>
              ) : (
                filteredProtocols.map((protocol) => (
                  <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-lg">
                              {getCategoryIcon(protocol.category)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">
                              {protocol.title}
                            </CardTitle>
                          </div>
                        </div>
                        <Badge className={getStatusColor(protocol.status)}>
                          {protocol.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {protocol.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {protocol.category}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
