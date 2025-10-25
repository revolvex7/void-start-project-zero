import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { membershipAPI, Membership, CreateMembershipData } from '@/lib/api';

export interface MembershipTier {
  id: string;
  name: string;
  price: string;
  description: string;
  memberCount: number;
  coverImage?: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MembershipContextType {
  tiers: MembershipTier[];
  addTier: (tier: Omit<MembershipTier, 'id'>) => Promise<void>;
  updateTier: (id: string, tier: Partial<MembershipTier>) => Promise<void>;
  deleteTier: (id: string) => Promise<void>;
  hasTiers: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

interface MembershipProviderProps {
  children: ReactNode;
}

export const MembershipProvider: React.FC<MembershipProviderProps> = ({ children }) => {
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch memberships - only called when explicitly needed
  const fetchMemberships = async () => {
    // Prevent duplicate fetches
    if (hasFetched || isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await membershipAPI.getAll();
      const memberships = response.data || [];
      
      // Transform API response to match MembershipTier interface
      const transformedTiers: MembershipTier[] = memberships.map((membership: Membership) => ({
        id: membership.id,
        name: membership.name,
        price: membership.price,
        description: membership.description || '',
        memberCount: membership.memberCount || 0,
        currency: membership.currency || 'NGN',
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
      }));
      
      setTiers(transformedTiers);
      setHasFetched(true);
    } catch (err) {
      console.error('Failed to fetch memberships:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch memberships');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't fetch on mount - let components call fetchMemberships when needed
  // useEffect(() => {
  //   fetchMemberships();
  // }, []);

  const addTier = async (tierData: Omit<MembershipTier, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const createData: CreateMembershipData = {
        name: tierData.name,
        price: tierData.price,
        description: tierData.description,
        currency: tierData.currency || 'NGN',
      };
      
      const response = await membershipAPI.create(createData);
      const newMembership = response.data;
      
      // Transform and add to local state
      const newTier: MembershipTier = {
        id: newMembership.id,
        name: newMembership.name,
        price: newMembership.price,
        description: newMembership.description || '',
        memberCount: newMembership.memberCount || 0,
        currency: newMembership.currency || 'NGN',
        createdAt: newMembership.createdAt,
        updatedAt: newMembership.updatedAt,
      };
      
      setTiers(prev => [...prev, newTier]);
    } catch (err) {
      console.error('Failed to create membership:', err);
      setError(err instanceof Error ? err.message : 'Failed to create membership');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTier = async (id: string, tierData: Partial<MembershipTier>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updateData = {
        name: tierData.name,
        price: tierData.price,
        description: tierData.description,
        currency: tierData.currency,
      };
      
      const response = await membershipAPI.update(id, updateData);
      const updatedMembership = response.data;
      
      // Update local state
      setTiers(prev => prev.map(tier => 
        tier.id === id ? {
          ...tier,
          name: updatedMembership.name,
          price: updatedMembership.price,
          description: updatedMembership.description || '',
          currency: updatedMembership.currency || 'NGN',
          updatedAt: updatedMembership.updatedAt,
        } : tier
      ));
    } catch (err) {
      console.error('Failed to update membership:', err);
      setError(err instanceof Error ? err.message : 'Failed to update membership');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTier = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await membershipAPI.delete(id);
      
      // Remove from local state
      setTiers(prev => prev.filter(tier => tier.id !== id));
    } catch (err) {
      console.error('Failed to delete membership:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete membership');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const hasTiers = tiers.length > 0;

  const value = {
    tiers,
    addTier,
    updateTier,
    deleteTier,
    hasTiers,
    isLoading,
    error,
    refetch: fetchMemberships,
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
