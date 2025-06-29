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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus, Send, Users, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Notification, User } from "@shared/schema";

const notificationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "warning", "success", "error"]),
  targetUsers: z.enum(["all", "role", "specific"]),
  targetRole: z.enum(["student", "researcher", "technician", "admin"]).optional(),
  specificUserIds: z.array(z.number()).optional(),
});

type NotificationFormData = z.infer<typeof notificationFormSchema>;

interface NotificationSystemProps {
  className?: string;
}

export default function NotificationSystem({ className }: NotificationSystemProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/admin/notifications"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "info",
      targetUsers: "all",
      targetRole: "student",
      specificUserIds: [],
    },
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      const res = await apiRequest("POST", "/api/admin/notifications", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Notification sent",
        description: "The notification has been successfully sent to users.",
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

  const onSubmit = (data: NotificationFormData) => {
    createNotificationMutation.mutate(data);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "info": return "default";
      case "warning": return "secondary";
      case "success": return "outline";
      case "error": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className={className}>
      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Send Notification
                  </CardTitle>
                  <CardDescription>
                    Send notifications to users about important updates and alerts
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Compose
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Notification</DialogTitle>
                      <DialogDescription>
                        Send a notification to users in your lab management system
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
                                  <Input placeholder="Notification title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your notification message..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="targetUsers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Send To</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select recipients" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="all">All Users</SelectItem>
                                  <SelectItem value="role">Specific Role</SelectItem>
                                  <SelectItem value="specific">Specific Users</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("targetUsers") === "role" && (
                          <FormField
                            control={form.control}
                            name="targetRole"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="student">Students</SelectItem>
                                    <SelectItem value="researcher">Researchers</SelectItem>
                                    <SelectItem value="technician">Technicians</SelectItem>
                                    <SelectItem value="admin">Administrators</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

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
                            disabled={createNotificationMutation.isPending}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Notification
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "Compose" to send a new notification to users</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View all notifications sent to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.slice(0, 20).map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          <Badge variant={getTypeBadgeVariant(notification.type)}>
                            {notification.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                      <TableCell>
                        <Users className="h-4 w-4 inline mr-1" />
                        User {notification.userId}
                      </TableCell>
                      <TableCell>{new Date(notification.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Pre-configured notification templates for common scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "System Maintenance",
                    message: "Scheduled system maintenance will occur on [DATE] from [TIME] to [TIME]. During this time, the system will be unavailable.",
                    type: "warning"
                  },
                  {
                    title: "New Protocol Available",
                    message: "A new laboratory protocol '[PROTOCOL_NAME]' has been added to the system. You can find it in the Protocols section.",
                    type: "info"
                  },
                  {
                    title: "Sample Processing Complete",
                    message: "Your sample '[SAMPLE_ID]' has completed processing. Results are now available in your reports section.",
                    type: "success"
                  },
                  {
                    title: "Equipment Malfunction",
                    message: "Equipment '[EQUIPMENT_NAME]' is currently out of service. Please use alternative equipment or contact technical support.",
                    type: "error"
                  },
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <CardTitle className="text-sm">{template.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{template.message}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          form.setValue("title", template.title);
                          form.setValue("message", template.message);
                          form.setValue("type", template.type as any);
                          setIsDialogOpen(true);
                        }}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}