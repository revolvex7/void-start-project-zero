import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { RoleProvider, useRole } from "./context/RoleContext";
import { LoadingState } from "./components/LoadingState";
import { useSocketProgress } from "./hooks/useSocketProgress";
import { useEffect } from "react";
import { authService } from "./services/authService";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import UploadSyllabus from "./pages/UploadSyllabus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ClassDetails from "./pages/ClassDetails";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CourseEditor from "./pages/CourseEditor";
import CourseDetail from "./pages/CourseDetail";
import CoursePreview from "./pages/CoursePreview";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Step1Goals from "./pages/onboarding/Step1Goals";
import Step2Users from "./pages/onboarding/Step2Users";
import Step3Industry from "./pages/onboarding/Step3Industry";
import Categories from "./pages/Categories";
import ParentDashboard from "./pages/ParentDashboard";
import ChildDetails from "./pages/ChildDetails";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import CourseStore from "./pages/CourseStore";
import CourseStoreDetails from "./pages/CourseStoreDetails";
import Subscription from "./pages/Subscription";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import GradingHub from "./pages/GradingHub";
import AssignmentGrading from "./pages/AssignmentGrading";
import Conferences from "./pages/Conferences";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LearnerAssignments from "./pages/LearnerAssignments";
import AssignmentAttempt from "./pages/AssignmentAttempt";
import HomeworkTutor from "./pages/HomeworkTutor";

const queryClient = new QueryClient();

const App = () => {
  // Check for subdomain on initial app load
  useEffect(() => {
    // Only check on production domains, not localhost
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Check if there's a domain in localStorage and we're not on the correct subdomain
      const storedDomain = localStorage.getItem('userDomain');
      if (storedDomain && !window.location.hostname.startsWith(`${storedDomain}.`)) {
        const currentPath = window.location.pathname;
        // If we're not on the login or register pages, redirect to the subdomain
        if (currentPath !== '/login' && currentPath !== '/register') {
          authService.redirectToSubdomain();
        }
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RoleProvider>
            <AuthProvider>
              <OnboardingProvider>
                <TooltipProvider>
                  <Sonner 
                    position="top-right"
                    expand={true}
                    closeButton={true}
                    richColors={true}
                    toastOptions={{
                      duration: 5000,
                      classNames: {
                        toast: "group border-b border-border shadow-lg rounded-lg overflow-hidden",
                        title: "font-medium text-foreground",
                        description: "text-muted-foreground text-sm", 
                        actionButton: "bg-primary text-primary-foreground",
                        cancelButton: "bg-muted text-muted-foreground",
                        success: "!bg-green-50 !text-green-600 dark:!bg-green-900/30 dark:!text-green-400 border-l-4 border-green-500",
                        error: "!bg-red-50 !text-red-600 dark:!bg-red-900/30 dark:!text-red-400 border-l-4 border-red-500",
                        warning: "!bg-amber-50 !text-amber-600 dark:!bg-amber-900/30 dark:!text-amber-400 border-l-4 border-amber-500",
                        info: "!bg-blue-50 !text-blue-600 dark:!bg-blue-900/30 dark:!text-blue-400 border-l-4 border-blue-500",
                      }
                    }}
                  />
                  <SubdomainHandler>
                    <AppRoutes />
                  </SubdomainHandler>
                </TooltipProvider>
              </OnboardingProvider>
            </AuthProvider>
          </RoleProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const SubdomainHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Only check for subdomain redirects if the user is authenticated
    if (isAuthenticated) {
      // Don't redirect on login/register pages
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        authService.redirectToSubdomain();
      }
    }
    
    // Add subdomain info to document title
    const domain = authService.getUserDomain();
    if (domain && domain !== 'ilmee') {
      document.title = `${domain} | Ilmee`;
    }
  }, [isAuthenticated, location.pathname]);
  
  return <>{children}</>;
};

// Admin route protection component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user?.role !== 'Administrator' && user?.role !== 'administrator') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Instructor route protection component - allows admins with instructor role context
const InstructorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { role } = useRole();
  
  // Allow if user is actually an instructor OR if user is admin with instructor role selected
  const isInstructor = user?.role === 'Instructor' || user?.role === 'instructor';
  const isAdminAsInstructor = (user?.role === 'Administrator' || user?.role === 'administrator') && role === 'instructor';
  
  if (!isInstructor && !isAdminAsInstructor) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Learner route protection component - allows admins with learner role context
const LearnerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { role } = useRole();
  
  // Allow if user is actually a learner OR if user is admin with learner role selected
  const isLearner = user?.role === 'Learner' || user?.role === 'learner';
  const isAdminAsLearner = (user?.role === 'Administrator' || user?.role === 'administrator') && role === 'learner';
  
  if (!isLearner && !isAdminAsLearner) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Multi-role route protection component (for routes accessible by multiple roles)
const MultiRoleRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user } = useAuth();
  const { role } = useRole();
  
  const userRole = user?.role?.toLowerCase();
  const selectedRole = role?.toLowerCase();
  
  // Check if user's actual role is in allowed roles
  const isActualRoleAllowed = allowedRoles.some(allowedRole => allowedRole.toLowerCase() === userRole);
  
  // Check if user is admin and their selected role is in allowed roles
  const isAdminWithAllowedRole = (userRole === 'administrator') && allowedRoles.some(allowedRole => allowedRole.toLowerCase() === selectedRole);
  
  if (!isActualRoleAllowed && !isAdminWithAllowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  useSocketProgress();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          {/* Root dashboard - accessible by all authenticated users */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Role-specific dashboards */}
          <Route path="/instructor-dashboard" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
          <Route path="/learner-dashboard" element={<LearnerRoute><LearnerDashboard /></LearnerRoute>} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          
          {/* Admin-only routes */}
          <Route path="/upload-syllabus" element={<AdminRoute><UploadSyllabus /></AdminRoute>} />
          <Route path="/categories" element={<AdminRoute><Categories /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/users/:userId" element={<AdminRoute><UserDetails /></AdminRoute>} />
          <Route path="/course-store" element={<AdminRoute><CourseStore /></AdminRoute>} />
          <Route path="/course-store/course/:courseId" element={<AdminRoute><CourseStoreDetails /></AdminRoute>} />
          <Route path="/subscription" element={<AdminRoute><Subscription /></AdminRoute>} />
          
          {/* Instructor-only routes */}
          <Route path="/grading-hub" element={<InstructorRoute><GradingHub /></InstructorRoute>} />
          <Route path="/grading-hub/assignment/:assignmentId" element={<InstructorRoute><AssignmentGrading /></InstructorRoute>} />
          <Route path="/conferences" element={<InstructorRoute><Conferences /></InstructorRoute>} />
          
          {/* Learner-only routes */}
          <Route path="/assignments" element={<LearnerRoute><LearnerAssignments /></LearnerRoute>} />
          <Route path="/assignment/:assignmentId/attempt" element={<LearnerRoute><AssignmentAttempt /></LearnerRoute>} />
          <Route path="/homework-tutor" element={<LearnerRoute><HomeworkTutor /></LearnerRoute>} />
          
          {/* Multi-role routes (Admin + Instructor) */}
          <Route path="/courses" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor']}><Courses /></MultiRoleRoute>} />
          <Route path="/groups" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor']}><Groups /></MultiRoleRoute>} />
          <Route path="/groups/:groupId" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor']}><GroupDetails /></MultiRoleRoute>} />
          <Route path="/reports" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor']}><Reports /></MultiRoleRoute>} />
          <Route path="/reports/courses" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor']}><Reports /></MultiRoleRoute>} />
          <Route path="/reports/groups" element={<AdminRoute><Reports /></AdminRoute>} />
          <Route path="/reports/users" element={<AdminRoute><Reports /></AdminRoute>} />
          <Route path="/reports/categories" element={<AdminRoute><Reports /></AdminRoute>} />
          <Route path="/reports/students" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor']}><Reports /></MultiRoleRoute>} />
          <Route path="/reports/assignments" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor']}><Reports /></MultiRoleRoute>} />
          
          {/* Multi-role routes (Admin + Instructor + Learner) */}
          <Route path="/my-courses" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor', 'learner']}><MyCourses /></MultiRoleRoute>} />
          <Route path="/course/:courseId" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor', 'learner']}><CourseDetail /></MultiRoleRoute>} />
          <Route path="/course/:courseId/preview" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor', 'learner']}><CoursePreview /></MultiRoleRoute>} />
          <Route path="/class/:moduleId/:classId" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor', 'learner']}><ClassDetails /></MultiRoleRoute>} />
          <Route path="/quiz/:classId" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor', 'learner']}><Quiz /></MultiRoleRoute>} />
          <Route path="/calendar" element={<MultiRoleRoute allowedRoles={['administrator', 'instructor', 'learner']}><Calendar /></MultiRoleRoute>} />
          
          {/* Universal routes (accessible by all roles) */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Route for course editor - outside MainLayout, accessible by Admin + Instructor */}
        <Route path="/course/:courseId/edit" element={<PrivateRoute><MultiRoleRoute allowedRoles={['administrator', 'instructor']}><CourseEditor /></MultiRoleRoute></PrivateRoute>} />
        
        {/* Routes outside MainLayout for sidebar-less parent pages */}
        <Route path="/parent/child/:childId" element={<PrivateRoute><ChildDetails /></PrivateRoute>} />
        
        {/* Onboarding routes - Admin only */}
        <Route path="/onboarding/step1" element={<PrivateRoute><AdminRoute><Step1Goals /></AdminRoute></PrivateRoute>} />
        <Route path="/onboarding/step2" element={<PrivateRoute><AdminRoute><Step2Users /></AdminRoute></PrivateRoute>} />
        <Route path="/onboarding/step3" element={<PrivateRoute><AdminRoute><Step3Industry /></AdminRoute></PrivateRoute>} />
        
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState 
          message="Loading your dashboard" 
          progress={75} 
          variant="spinner" 
          className="py-8 max-w-md"
        />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState 
          message="Checking authentication" 
          progress={60} 
          variant="spinner" 
          className="py-8 max-w-md"
        />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default App;
