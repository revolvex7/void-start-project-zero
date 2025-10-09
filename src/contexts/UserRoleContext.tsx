import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export type UserRole = 'member' | 'creator';

interface UserRoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('member');
  const location = useLocation();

  // Initialize role based on URL or stored context
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const viewParam = searchParams.get('view');
    const storedContext = sessionStorage.getItem('userRoleContext');
    
    if (viewParam === 'creator') {
      setCurrentRole('creator');
      sessionStorage.setItem('userRoleContext', 'creator');
    } else if (viewParam === 'member' || viewParam === 'fan') {
      setCurrentRole('member');
      sessionStorage.setItem('userRoleContext', 'member');
    } else if (storedContext === 'creator' || storedContext === 'member') {
      setCurrentRole(storedContext as UserRole);
    } else {
      // Default to member for new users
      setCurrentRole('member');
      sessionStorage.setItem('userRoleContext', 'member');
    }
  }, [location.search]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    sessionStorage.setItem('userRoleContext', role);
  };

  const value = {
    currentRole,
    setCurrentRole,
    switchRole,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
