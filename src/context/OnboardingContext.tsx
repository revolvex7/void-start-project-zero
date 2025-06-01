import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import { toast } from 'sonner';

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
  goals: string[];
  mainGoal: string | null;
  userRange: string | null;
  industry: string | null;
  setGoals: (goals: string[]) => void;
  setMainGoal: (goal: string) => void;
  setUserRange: (range: string) => void;
  setIndustry: (industry: string) => void;
  getOnboardingData: () => {
    mainGoal: string[];
    portalUsers: string;
    industry: string;
  };
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [mainGoal, setMainGoal] = useState<string | null>(null);
  const [userRange, setUserRange] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = useAuth();

  // Helper function to handle role-based redirects
  const handleRoleBasedRedirect = () => {
    if (!auth.user?.role) return;

    switch (auth.user.role) {
      case 'Learner':
        navigate('/learner-dashboard');
        break;
      case 'Instructor':
        navigate('/instructor-dashboard');
        break;
      case 'Administrator':
        // Only administrators need to complete onboarding
        if (!isOnboardingComplete && !window.location.pathname.includes('/onboarding')) {
          navigate('/onboarding/step1');
        }
        break;
      default:
        // For any other role, redirect to the main dashboard
        navigate('/');
    }
  };
  
  // Check if onboarding is complete based on user.mainGoal and role
  useEffect(() => {
    if (auth.user) {
      // For Learners and Instructors, onboarding is always considered complete
      const isLearnerOrInstructor = auth.user.role === 'Learner' || auth.user.role === 'Instructor';
      
      if (isLearnerOrInstructor) {
        setIsOnboardingComplete(true);
        handleRoleBasedRedirect();
        return;
      }

      // For Administrator, check if onboarding is complete
      const hasCompletedOnboarding = auth.user.mainGoal && 
                                    Array.isArray(auth.user.mainGoal) && 
                                    auth.user.mainGoal.length > 0;
      
      setIsOnboardingComplete(hasCompletedOnboarding);
      
      // If administrator hasn't completed onboarding, redirect to onboarding
      if (auth.isAuthenticated && !hasCompletedOnboarding && auth.user.role === 'Administrator') {
        if (!window.location.pathname.includes('/onboarding')) {
          navigate('/onboarding/step1');
        }
      }
      
      // Load saved onboarding data from user object if available
      if (auth.user.mainGoal && Array.isArray(auth.user.mainGoal) && auth.user.mainGoal.length > 0) {
        setMainGoal(auth.user.mainGoal[0]);
      }
      
      if (auth.user.portalUsers) {
        setUserRange(auth.user.portalUsers);
      }
      
      if (auth.user.industry) {
        setIndustry(auth.user.industry);
      }
    } else {
      // If no user, load from localStorage as fallback
      const savedGoals = localStorage.getItem('onboardingGoals');
      const savedMainGoal = localStorage.getItem('onboardingMainGoal');
      const savedUserRange = localStorage.getItem('onboardingUserRange');
      const savedIndustry = localStorage.getItem('onboardingIndustry');
      
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedMainGoal) setMainGoal(savedMainGoal);
      if (savedUserRange) setUserRange(savedUserRange);
      if (savedIndustry) setIndustry(savedIndustry);
    }
  }, [auth.user, auth.isAuthenticated, navigate]);

  // Safe reference to refreshUserData
  const refreshUserData = auth.refreshUserData;

  const completeOnboarding = async () => {
    try {
      // Only proceed with onboarding completion for administrators
      if (auth.user?.role === 'Administrator') {
        const onboardingData = getOnboardingData();
        console.log("Completing onboarding with data:", onboardingData);
        
        await userService.updateUser({
          mainGoal: onboardingData.mainGoal,
          portalUsers: onboardingData.portalUsers,
          industry: onboardingData.industry
        });
        
        if (refreshUserData) {
          await refreshUserData();
        }
        
        setIsOnboardingComplete(true);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to save your preferences. Please try again.');
    }
  };

  const getOnboardingData = () => {
    const mainGoalValue = mainGoal || localStorage.getItem('onboardingMainGoal');
    return {
      mainGoal: mainGoalValue ? [mainGoalValue] : [],
      portalUsers: userRange || localStorage.getItem('onboardingUserRange') || '',
      industry: industry || localStorage.getItem('onboardingIndustry') || ''
    };
  };

  return (
    <OnboardingContext.Provider 
      value={{
        isOnboardingComplete,
        completeOnboarding,
        goals,
        mainGoal,
        userRange,
        industry,
        setGoals,
        setMainGoal,
        setUserRange,
        setIndustry,
        getOnboardingData
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
