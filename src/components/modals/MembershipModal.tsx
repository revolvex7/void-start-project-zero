import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TipModal } from '@/components/modals/TipModal';
import { useCreatorMemberships } from '@/hooks/useApi';
import type { Membership } from '@/lib/api';

interface MembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  creatorId: string;
}

export function MembershipModal({ open, onOpenChange, creatorName, creatorId }: MembershipModalProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);

  // Fetch creator memberships when modal is open
  const { data: memberships, isLoading, error } = useCreatorMemberships(creatorId, open);

  // Only paid tiers (exclude free)
  const paidTiers: Membership[] = Array.isArray(memberships)
    ? (memberships as Membership[]).filter((m) => Number(m.price) > 0)
    : [];

  const handleDashMe = () => {
    onOpenChange(false); // Close membership modal
    setShowTipModal(true); // Open tip modal
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent className="max-w-4xl bg-gray-900 text-white border border-gray-700 p-0 max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                🎬
              </div>
              <span className="text-lg font-semibold">{creatorName}</span>
            </div>
          </div>

          <div className="p-6">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Choose your membership</h2>
              <p className="text-gray-400">Support {creatorName} and get access to exclusive content</p>
            </div>

            {/* Membership Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {isLoading && (
                <div className="col-span-full text-center py-8 text-gray-400">Loading memberships...</div>
              )}
              {!isLoading && error && (
                <div className="col-span-full text-center py-8 text-red-400">Failed to load memberships</div>
              )}
              {!isLoading && !error && paidTiers.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400">No paid memberships available</div>
              )}
              {!isLoading && !error && paidTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative bg-gray-800 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedTier === tier.id ? 'border-green-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  <div className="p-6">
                    {/* Tier Name & Price */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold">{tier.currency} {tier.price}</span>
                        <span className="text-gray-400">/ month</span>
                      </div>
                    </div>

                    {/* Join Button */}
                    <Button 
                      className={`w-full mb-4 ${selectedTier === tier.id ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      Subscribe
                    </Button>

                    {/* Benefits */}
                    {tier.description && (
                      <p className="text-sm text-gray-300 leading-relaxed">{tier.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dash Me Button */}
            <div className="text-center">
              <Button
                onClick={handleDashMe}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-8 py-2"
              >
                💸 Dash Me
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tip Modal */}
      {showTipModal && (
        <TipModal
          open={showTipModal}
          onOpenChange={setShowTipModal}
          creatorName={creatorName}
        />
      )}
    </>
  );
}