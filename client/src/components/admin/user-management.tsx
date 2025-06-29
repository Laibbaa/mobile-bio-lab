import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Users, UserCheck, UserX, Edit, Trash2, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import { z } from "zod";

const userUpdateSchema = z.object({
  role: z.enum(["student", "researcher", "technician", "admin"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  city: z.string().optional(),
});

type UserUpdateData = z.infer<typeof userUpdateSchema>;

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User deleted",
        description: "The user has been successfully removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: number; data: UserUpdateData }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${userId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingUser(null);
      toast({
        title: "User updated",
        description: "User information has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<UserUpdateData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      role: "student",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      city: "",
    },
  });

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-destructive text-destructive-foreground";
      case "researcher": return "bg-primary text-primary-foreground";
      case "technician": return "bg-secondary text-secondary-foreground";
      case "student": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return "👑";
      case "researcher": return "🔬";
      case "technician": return "🔧";
      case "student": return "🎓";
      default: return "👤";
    }
  };

  const handleEdit = (userToEdit: User) => {
    setEditingUser(userToEdit);
    form.reset({
      role: userToEdit.role as "student" | "researcher" | "technician" | "admin",
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
      mobile: userToEdit.mobile || "",
      city: userToEdit.city || "",
    });
  };

  const onSubmit = (data: UserUpdateData) => {
    if (editingUser) {
      updateUserMutation.mutate({ userId: editingUser.id, data });
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to access this component.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    researchers: users.filter(u => u.role === "researcher").length,
    technicians: users.filter(u => u.role === "technician").length,
    students: users.filter(u => u.role === "student").length,
  };

  return (
    <div className="space-y-8">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{userStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {[
          { label: "Admins", count: userStats.admins, icon: "👑" },
          { label: "Researchers", count: userStats.researchers, icon: "🔬" },
          { label: "Technicians", count: userStats.technicians, icon: "🔧" },
          { label: "Students", count: userStats.students, icon: "🎓" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, username, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            System Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No users found matching your search." : "No users found."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userRow) => (
                  <TableRow key={userRow.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span>{getRoleIcon(userRow.role)}</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {userRow.firstName} {userRow.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userRow.mobile || "No phone"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {userRow.username}
                    </TableCell>
                    <TableCell>{userRow.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(userRow.role)}>
                        {userRow.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{userRow.city || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(userRow.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog open={editingUser?.id === userRow.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(userRow)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="role"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Role</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="student">Student</SelectItem>
                                          <SelectItem value="researcher">Researcher</SelectItem>
                                          <SelectItem value="technician">Technician</SelectItem>
                                          <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="mobile"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Mobile</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={updateUserMutation.isPending}>
                                    {updateUserMutation.isPending ? "Updating..." : "Update User"}
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        {userRow.id !== user?.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {userRow.firstName} {userRow.lastName}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUserMutation.mutate(userRow.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
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
  );
}
