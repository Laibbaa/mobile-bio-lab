import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Calendar, Save, Edit } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "technician": return "default";
      case "researcher": return "secondary";
      case "student": return "outline";
      default: return "outline";
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{user.username}</h3>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </Button>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                          <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Account Created
                        </Label>
                        <p className="text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          User ID
                        </Label>
                        <p className="text-sm font-mono">{user.id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline">
                        Change Password
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Password security features coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Customize your lab management experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Preference settings coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}