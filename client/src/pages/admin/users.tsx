import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import UserManagement from "@/components/admin/user-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Users, UserCheck, UserX, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect non-admin users
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You need admin privileges to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${userId}`, { role });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User updated",
        description: "User role has been successfully updated.",
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

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    researchers: users.filter(u => u.role === "researcher").length,
    technicians: users.filter(u => u.role === "technician").length,
    students: users.filter(u => u.role === "student").length,
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
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-2">
                  Manage system users and their permissions
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Admin Panel</span>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">👑</span>
                    <div>
                      <p className="text-2xl font-bold">{userStats.admins}</p>
                      <p className="text-xs text-muted-foreground">Admins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🔬</span>
                    <div>
                      <p className="text-2xl font-bold">{userStats.researchers}</p>
                      <p className="text-xs text-muted-foreground">Researchers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <p className="text-2xl font-bold">{userStats.technicians}</p>
                      <p className="text-xs text-muted-foreground">Technicians</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🎓</span>
                    <div>
                      <p className="text-2xl font-bold">{userStats.students}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="mb-8">
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
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              {userRow.id !== user?.id && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive">
                                      Delete
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
        </main>
      </div>
    </div>
  );
}
