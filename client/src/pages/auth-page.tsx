import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Microscope,
  // Users,
  // FlaskConical,
  // BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetForm, setResetForm] = useState({ username: "", password: "" });

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    role: "student" as "student" | "researcher" | "technician",
    city: "",
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Reset failed");
      return res.json();
    },
    onSuccess: () => {
      setShowReset(false);
      setIsLogin(true);
    },
    onError: () => {
      // toast({
      //   title: "Reset failed",
      //   description: "Check your username and try again.",
      //   variant: "destructive",
      // });
        },
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      ...loginForm,
      username: loginForm.username.toLowerCase(),
    });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProfilePicPreview(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profilePic) {
      const formData = new FormData();
      Object.entries(registerForm).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("profilePic", profilePic);
      registerMutation.mutate(formData as any);
    } else {
      registerMutation.mutate({
        ...registerForm,
        username: registerForm.username.toLowerCase(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-center space-x-3">
              <div className="p-3 bg-primary rounded-lg">
                <Microscope className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Mobile Bio Lab
              </h1>
            </div>
            <p className="text-xl text-center text-muted-foreground">
              Advanced biological research at your fingertips
            </p>
            <p className="text-lg text-center text-muted-foreground max-w-lg">
              Join ABC Laboratories' innovative platform for remote biological
              sample analysis, data visualization, and collaborative research.
            </p>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <FlaskConical className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-sm">Sample Collection</h3>
              <p className="text-xs text-muted-foreground text-center">
                Advanced sample tracking with QR codes and sensor integration
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-accent/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-sm">Data Analysis</h3>
              <p className="text-xs text-muted-foreground text-center">
                Interactive visualizations and automated report generation
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-success/10 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-sm">Collaboration</h3>
              <p className="text-xs text-muted-foreground text-center">
                Share findings with researchers worldwide
              </p>
            </div>
          </div> */}
        </div>

        {/* Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center space-x-2 mb-4">
                <Button
                  variant={isLogin ? "default" : "outline"}
                  onClick={() => setIsLogin(true)}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button
                  variant={!isLogin ? "default" : "outline"}
                  onClick={() => setIsLogin(false)}
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>
              <CardTitle className="text-2xl text-center">
                {isLogin ? "Welcome back" : "Create account"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin
                  ? "Enter your credentials to access your lab account"
                  : "Join the Mobile Bio Lab community"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin && !showReset && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="login-password">Password</label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary underline"
                      onClick={() => setShowReset(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              )}
              {showReset && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    resetPasswordMutation.mutate(resetForm);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label htmlFor="reset-username">Username</label>
                    <Input
                      id="reset-username"
                      value={resetForm.username}
                      onChange={(e) =>
                        setResetForm({ ...resetForm, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reset-password">New Password</label>
                    <Input
                      id="reset-password"
                      type="password"
                      value={resetForm.password}
                      onChange={(e) =>
                        setResetForm({ ...resetForm, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending
                        ? "Resetting..."
                        : "Reset Password"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowReset(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              {!isLogin && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName">First Name</label>
                      <Input
                        id="firstName"
                        value={registerForm.firstName}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName">Last Name</label>
                      <Input
                        id="lastName"
                        value={registerForm.lastName}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="username">Username</label>
                    <Input
                      id="username"
                      value={registerForm.username}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showRegisterPassword ? "text" : "password"}
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            password: e.target.value,
                          })
                        }
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowRegisterPassword(!showRegisterPassword)
                        }
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role">Role</label>
                    <Select
                      value={registerForm.role}
                      onValueChange={(
                        value: "student" | "researcher" | "technician"
                      ) => setRegisterForm({ ...registerForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="mobile">Mobile</label>
                      <Input
                        id="mobile"
                        value={registerForm.mobile}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            mobile: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="city">City</label>
                      <Input
                        id="city"
                        value={registerForm.city}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="profilePic">Profile Picture</label>
                    <input
                      id="profilePic"
                      name="profilePic"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleProfilePicChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {profilePicPreview && (
                      <img
                        src={profilePicPreview}
                        alt="Profile Preview"
                        className="mt-2 w-24 h-24 object-cover border"
                      />
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
