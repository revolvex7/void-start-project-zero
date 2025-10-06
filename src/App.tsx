import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import SignupComplete from '@/pages/SignupComplete';
import SignupName from '@/pages/SignupName';
import Dashboard from '@/pages/Dashboard';
import CreatorProfile from '@/pages/CreatorProfile';
import CreatePost from '@/pages/CreatePost';
import NotFound from '@/pages/NotFound';

// Creator pages
import Podcasters from '@/pages/Podcasters';
import VideoCreators from '@/pages/VideoCreators';
import Musicians from '@/pages/Musicians';
import Artists from '@/pages/Artists';
import GameDevs from '@/pages/GameDevs';
import Product from '@/pages/Product';

// Feature pages
import CreateOnYourTerms from '@/pages/CreateOnYourTerms';
import OnlineCommunity from '@/pages/OnlineCommunity';
import ExpandYourReach from '@/pages/ExpandYourReach';

// Protected Route Component
import ProtectedRoute from '@/components/ProtectedRoute';
import BusinessSupport from './pages/BusinessSupport';
import EarningMadeEasy from './pages/EarningMadeEasy';
import Pricing from './pages/Pricing';

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
              path="/c/:creatorUrl" 
              element={
                <ProtectedRoute>
                  <CreatorProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/c/:creatorUrl/create-post" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
