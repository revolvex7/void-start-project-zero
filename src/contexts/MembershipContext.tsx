import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  memberCount: number;
  coverImage?: string;
}

interface MembershipContextType {
  tiers: MembershipTier[];
  addTier: (tier: Omit<MembershipTier, 'id'>) => void;
  updateTier: (id: string, tier: Partial<MembershipTier>) => void;
  deleteTier: (id: string) => void;
  hasTiers: boolean;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

interface MembershipProviderProps {
  children: ReactNode;
}

export const MembershipProvider: React.FC<MembershipProviderProps> = ({ children }) => {
  const [tiers, setTiers] = useState<MembershipTier[]>([]);

  const addTier = (tierData: Omit<MembershipTier, 'id'>) => {
    const newTier: MembershipTier = {
      ...tierData,
      id: Date.now().toString(),
    };
    setTiers(prev => [...prev, newTier]);
  };

  const updateTier = (id: string, tierData: Partial<MembershipTier>) => {
    setTiers(prev => prev.map(tier => 
      tier.id === id ? { ...tier, ...tierData } : tier
    ));
  };

  const deleteTier = (id: string) => {
    setTiers(prev => prev.filter(tier => tier.id !== id));
  };

  const hasTiers = tiers.length > 0;

  const value = {
    tiers,
    addTier,
    updateTier,
    deleteTier,
    hasTiers,
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = (): MembershipContextType => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};
