import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import { MembershipProvider } from '@/contexts/MembershipContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import SignupComplete from '@/pages/SignupComplete';
import SignupName from '@/pages/SignupName';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import CreatorProfile from '@/pages/CreatorProfile';
import CreatePost from '@/pages/CreatePost';
import Library from '@/pages/Library';
import EditCreatorPage from '@/pages/EditCreatorPage';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Membership from '@/pages/Membership';
import Insights from '@/pages/Insights';
import MemberChat from '@/pages/MemberChat';
import CreatorChat from '@/pages/CreatorChat';
import Payouts from '@/pages/Payouts';
import MemberNotifications from '@/pages/MemberNotifications';
import CreatorNotifications from '@/pages/CreatorNotifications';
import PostPreview from '@/pages/PostPreview';
import MemberSettings from '@/pages/MemberSettings';
import CreatorSettings from '@/pages/CreatorSettings';

// Creator pages
import Podcasters from '@/pages/Podcasters';
import Musicians from '@/pages/Musicians';
import Artists from '@/pages/Artists';
import GameDevs from '@/pages/GameDevs';
import Product from '@/pages/Product';
import VideoCreators from '@/pages/VideoCreators';

// Feature pages
import CreateOnYourTerms from '@/pages/CreateOnYourTerms';
import OnlineCommunity from '@/pages/OnlineCommunity';
import ExpandYourReach from '@/pages/ExpandYourReach';
import BusinessSupport from '@/pages/BusinessSupport';
import EarningMadeEasy from '@/pages/EarningMadeEasy';
import Pricing from '@/pages/Pricing';

// Protected Route Component
import ProtectedRoute from '@/components/ProtectedRoute';

// Public Route Component (redirects if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <UserRoleProvider>
          <MembershipProvider>
            <div className="App">
            <Routes>
            {/* Public Routes - Only accessible when not logged in */}
            <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
            
            {/* Creator Category Pages - Only accessible when not logged in */}
            <Route path="/creators/podcasts" element={<PublicRoute><Podcasters /></PublicRoute>} />
            <Route path="/creators/video" element={<PublicRoute><VideoCreators /></PublicRoute>} />
            <Route path="/creators/music" element={<PublicRoute><Musicians /></PublicRoute>} />
            <Route path="/creators/visualartists" element={<PublicRoute><Artists /></PublicRoute>} />
            <Route path="/creators/gaming" element={<PublicRoute><GameDevs /></PublicRoute>} />
            
            {/* Product/Feature Pages - Only accessible when not logged in */}
            <Route path="/product/create" element={<PublicRoute><Product /></PublicRoute>} />
            <Route path="/features/create-on-your-terms" element={<PublicRoute><CreateOnYourTerms /></PublicRoute>} />
            <Route path="/features/online-community" element={<PublicRoute><OnlineCommunity /></PublicRoute>} />
            <Route path="/features/expand-your-reach" element={<PublicRoute><ExpandYourReach /></PublicRoute>} />
            <Route path="/features/get-business-support" element={<PublicRoute><BusinessSupport /></PublicRoute>} />
            <Route path="/features/earning-made-easy" element={<PublicRoute><EarningMadeEasy /></PublicRoute>} />
            <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />
            
            {/* Auth Routes - Only accessible when not logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup/complete" 
              element={
                <PublicRoute>
                  <SignupComplete />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup/name" 
              element={
                <PublicRoute>
                  <SignupName />
                </PublicRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              } 
            />

            {/* Protected Routes - Only accessible when logged in */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/explore" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/notifications" 
              element={
                <ProtectedRoute>
                  <MemberNotifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/settings" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/:creatorUrl" 
              element={
                <ProtectedRoute>
                  <CreatorProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customize" 
              element={
                <ProtectedRoute>
                  <EditCreatorPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/library" 
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/membership" 
              element={
                <ProtectedRoute>
                  <Membership />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/:creatorUrl/membership" 
              element={
                <ProtectedRoute>
                  <Membership />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insights" 
              element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/member/chat" 
              element={
                <ProtectedRoute>
                  <MemberChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/chat" 
              element={
                <ProtectedRoute>
                  <CreatorChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payouts" 
              element={
                <ProtectedRoute>
                  <Payouts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <CreatorNotifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post/:postId" 
              element={
                <ProtectedRoute>
                  <PostPreview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/member-settings" 
              element={
                <ProtectedRoute>
                  <MemberSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator-settings" 
              element={
                <ProtectedRoute>
                  <CreatorSettings />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
        </MembershipProvider>
        </UserRoleProvider>
      </Router>
    </AuthProvider>
  );
}
export default App;
