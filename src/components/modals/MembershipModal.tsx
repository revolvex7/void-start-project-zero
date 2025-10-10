import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
}

const membershipTiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    badge: 'FREE',
    benefits: [
      'Access to all free posts and content',
      'Public updates and announcements',
      'Community discussions and interactions',
      'Follow to stay updated with new releases'
    ]
  },
  {
    id: 'subscription',
    name: 'Monthly Subscription',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=300&fit=crop',
    badge: 'RECOMMENDED',
    benefits: [
      'Everything in Free tier',
      'Access to all exclusive members-only posts',
      'Early access to new content and releases',
      'Behind-the-scenes content and updates',
      'Direct messaging with creator',
      'Support the creator directly'
    ]
  }
];

export function MembershipModal({ open, onOpenChange, creatorName }: MembershipModalProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
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
            {membershipTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-gray-800 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedTier === tier.id ? 'border-green-500' : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <div className="p-6">
                  {/* Badge */}
                  {tier.badge && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      tier.id === 'subscription' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      {tier.badge}
                    </div>
                  )}
                  
                  {/* Tier Name & Price */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">${tier.price}</span>
                      {tier.price > 0 && <span className="text-gray-400">/ month</span>}
                      {tier.price === 0 && <span className="text-gray-400">forever</span>}
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button 
                    className={`w-full mb-4 ${
                      tier.id === 'free'
                        ? 'bg-green-600 hover:bg-green-700'
                        : selectedTier === tier.id 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {tier.id === 'free' ? 'Follow' : 'Subscribe'}
                  </Button>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {tier.benefits.map((benefit, index) => (
                      <p key={index} className="text-sm text-gray-300 leading-relaxed">
                        {benefit}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}