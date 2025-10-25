import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TipModal } from '@/components/modals/TipModal';
import { useSubscribeMembership, useUnsubscribeMembership } from '@/hooks/useApi';
import type { Membership } from '@/lib/api';
import { Check } from 'lucide-react';

interface MembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  creatorId: string;
  memberships: Membership[];
  onSubscribeSuccess?: () => void;
}

export function MembershipModal({ open, onOpenChange, creatorName, creatorId, memberships, onSubscribeSuccess }: MembershipModalProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);

  const subscribeMutation = useSubscribeMembership();
  const unsubscribeMutation = useUnsubscribeMembership();

  // Only paid tiers (exclude free)
  const paidTiers: Membership[] = Array.isArray(memberships)
    ? memberships.filter((m) => Number(m.price) > 0)
    : [];

  const handleDashMe = () => {
    onOpenChange(false); // Close membership modal
    setShowTipModal(true); // Open tip modal
  };

  const handleSubscribe = async (membershipId: string, isSubscribed: boolean) => {
    try {
      if (isSubscribed) {
        // Unsubscribe - send creatorId
        await unsubscribeMutation.mutateAsync(creatorId);
      } else {
        // Subscribe - send membershipId
        await subscribeMutation.mutateAsync(membershipId);
      }
      // Call success callback to refetch creator data
      if (onSubscribeSuccess) {
        onSubscribeSuccess();
      }
      // Close modal on success
      onOpenChange(false);
    } catch (error: any) {
      console.error('Subscription action failed:', error);
      // Error is already logged by the mutation
    }
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
            <div className="space-y-4 mb-6">
              {paidTiers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No paid memberships available</div>
                  <p className="text-gray-500 text-sm">Check back later for membership options</p>
                </div>
              ) : (
                paidTiers.map((tier, index) => {
                  const isSubscribed = tier.isSubscribed || false;
                  
                  return (
                    <div
                      key={tier.id}
                      className={`relative bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl border-2 transition-all ${
                        isSubscribed
                          ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                          : selectedTier === tier.id 
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                            : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="p-6">
                        {/* Tier Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                              {isSubscribed && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <Check size={12} />
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="flex items-baseline space-x-2">
                              <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {tier.currency} {tier.price}
                              </span>
                              <span className="text-gray-400 text-lg">/ month</span>
                            </div>
                          </div>
                          {selectedTier === tier.id && !isSubscribed && (
                            <div className="bg-blue-500 rounded-full p-2">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {tier.description && (
                          <div className="mb-6">
                            <p className="text-gray-300 leading-relaxed">{tier.description}</p>
                          </div>
                        )}

                        {/* Subscribe/Unsubscribe Button */}
                        <Button 
                          onClick={() => handleSubscribe(tier.id, isSubscribed)}
                          disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
                          className={`w-full py-6 text-lg font-semibold rounded-xl transition-all ${
                            isSubscribed
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                              : selectedTier === tier.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                                : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {subscribeMutation.isPending || unsubscribeMutation.isPending ? (
                            <span className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              {isSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
                            </span>
                          ) : isSubscribed ? (
                            <>
                              <Check className="w-5 h-5 mr-2 inline" />
                              Subscribed - Click to Unsubscribe
                            </>
                          ) : (
                            'Subscribe Now'
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
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