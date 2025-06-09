import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { User, Phone, Key, Save, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Link } from "react-router-dom";

// Schema for parent profile update
const ParentProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

// Schema for password update
const PasswordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ParentProfileFormData = z.infer<typeof ParentProfileSchema>;
type PasswordUpdateFormData = z.infer<typeof PasswordUpdateSchema>;

const ParentProfile = () => {
  const { user, refreshUserData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form setup
  const profileForm = useForm<ParentProfileFormData>({
    resolver: zodResolver(ParentProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  // Password form setup
  const passwordForm = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, profileForm]);

  const handleProfileUpdate = async (data: ParentProfileFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await userService.updateUser({
        name: data.name,
        phone: data.phone,
      });
      
      if (response) {
        await refreshUserData();
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (data: PasswordUpdateFormData) => {
    setIsSubmitting(true);
    
    try {
      await userService.updateUser({
        password: data.newPassword,
      });
      
      passwordForm.reset();
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/parent-dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
              Parent Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your profile information and account settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-purple-100 dark:border-purple-800">
                  <AvatarImage src={user?.profileImage || user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-2xl bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    {user?.name?.[0]?.toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                <div className="mt-3 px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 rounded-full text-sm">
                  Parent Account
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile Info
                </TabsTrigger>
                <TabsTrigger value="password" className="gap-2">
                  <Key className="h-4 w-4" />
                  Password
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter your full name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter your phone number" type="tel" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {isSubmitting ? "Updating..." : "Update Profile"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" placeholder="Enter current password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" placeholder="Enter new password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" placeholder="Confirm new password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
                          >
                            <Key className="h-4 w-4" />
                            {isSubmitting ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link to="/parent-dashboard">
            <Card className="p-4 hover:shadow-md transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80 cursor-pointer">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Dashboard</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">View children progress</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
            </Card>
          </Link>
          
          <Link to="/help">
            <Card className="p-4 hover:shadow-md transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80 cursor-pointer">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Help Center</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get support</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
            </Card>
          </Link>
          
          <Link to="/contact">
            <Card className="p-4 hover:shadow-md transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80 cursor-pointer">
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Contact Us</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Reach out for help</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile; 