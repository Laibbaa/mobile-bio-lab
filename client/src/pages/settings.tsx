import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Database, Palette, Globe, Save } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    sampleAlerts: true,
    reportGeneration: true,
    systemUpdates: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    defaultSampleType: "water",
  });

  const handleSave = () => {
    // TODO: Implement settings save API call
    console.log("Saving settings...", { notifications, preferences });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Configure your lab management system preferences
              </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="data">Data & Storage</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Configure basic system preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={preferences.language} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, language: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={preferences.timezone} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, timezone: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">Eastern Time</SelectItem>
                            <SelectItem value="PST">Pacific Time</SelectItem>
                            <SelectItem value="CST">Central Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={preferences.dateFormat} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, dateFormat: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="defaultSampleType">Default Sample Type</Label>
                        <Select value={preferences.defaultSampleType} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, defaultSampleType: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="water">Water</SelectItem>
                            <SelectItem value="soil">Soil</SelectItem>
                            <SelectItem value="plant">Plant</SelectItem>
                            <SelectItem value="biological_fluid">Biological Fluid</SelectItem>
                            <SelectItem value="air">Air</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about lab activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, email: checked }))
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via SMS
                          </p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, sms: checked }))
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive browser push notifications
                          </p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, push: checked }))
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sample Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about sample status changes
                          </p>
                        </div>
                        <Switch
                          checked={notifications.sampleAlerts}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, sampleAlerts: checked }))
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Report Generation</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when reports are ready
                          </p>
                        </div>
                        <Switch
                          checked={notifications.reportGeneration}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, reportGeneration: checked }))
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about system maintenance
                          </p>
                        </div>
                        <Switch
                          checked={notifications.systemUpdates}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data & Storage
                    </CardTitle>
                    <CardDescription>
                      Manage data retention and storage preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Data Retention</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          How long should sample data be retained?
                        </p>
                        <Select defaultValue="1year">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3months">3 Months</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="1year">1 Year</SelectItem>
                            <SelectItem value="indefinite">Indefinite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium">Export Format</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Default format for data exports
                        </p>
                        <Select defaultValue="csv">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize the look and feel of your interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Theme</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Choose your preferred color theme
                        </p>
                        <Select value={preferences.theme} onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, theme: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium">Density</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Control the spacing and density of UI elements
                        </p>
                        <Select defaultValue="comfortable">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="comfortable">Comfortable</SelectItem>
                            <SelectItem value="spacious">Spacious</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}