import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react';

interface MembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
}

const membershipTiers = [
  {
    id: 'platinum',
    name: 'Dee Hive Platinum',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=300&fit=crop',
    badge: 'PLATINUM',
    benefits: [
      'I post copyrighted content here that I cannot post on Youtube such as reactions to music videos, albums, live performances, etc.',
      'I do not take reaction requests from this Patreon anymore, I select the videos I\'m interested in that I think my audience would like to see as well.',
      'There are thousands of videos in the archive here that have not been posted on Youtube, so you will have access to those videos as well'
    ]
  },
  {
    id: 'diamond',
    name: 'Dee Hive Diamond VIP',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1589902726635-1d5ee5ad9f22?w=400&h=300&fit=crop',
    badge: 'YOU MIGHT LIKE',
    benefits: [
      'Show extra support! This tier gives the same exact access as the Platinum tier, it\'s just provided to those of you that want to give extra support.'
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
            
            {/* Annual Toggle */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAnnual ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
              <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                Pay annually (Save {creatorName === 'Brad Evans' ? '10%' : '20%'})
              </span>
            </div>
          </div>

          {/* Membership Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {membershipTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-gray-800 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedTier === tier.id ? 'border-green-500' : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    tier.id === 'diamond' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {tier.badge}
                  </div>
                )}

                {/* Tier Image */}
                <div className="h-48 relative">
                  <img 
                    src={tier.image} 
                    alt={tier.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
                </div>

                <div className="p-6">
                  {/* Tier Name & Price */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">${isAnnual ? (tier.price * 12 * 0.8).toFixed(2) : tier.price}</span>
                      <span className="text-gray-400">/ {isAnnual ? 'year' : 'month'}</span>
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button 
                    className={`w-full mb-4 ${
                      selectedTier === tier.id 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Join
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

          {/* Gift Option */}
          <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">Gift a membership to {creatorName}</span>
            </div>
            <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800">
              Gift now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}