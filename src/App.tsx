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
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Creator Category Pages */}
            <Route path="/creators/podcasts" element={<Podcasters />} />
            <Route path="/creators/video" element={<VideoCreators />} />
            <Route path="/creators/music" element={<Musicians />} />
            <Route path="/creators/visualartists" element={<Artists />} />
            <Route path="/creators/gaming" element={<GameDevs />} />
            
            {/* Product/Feature Pages */}
            <Route path="/product/create" element={<Product />} />
            <Route path="/features/create-on-your-terms" element={<CreateOnYourTerms />} />
            <Route path="/features/online-community" element={<OnlineCommunity />} />
            
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
