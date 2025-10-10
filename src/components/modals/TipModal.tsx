import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, Heart, Coffee, Zap, X } from 'lucide-react';

interface TipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
}

const quickTipAmounts = [5, 10, 20, 50];

export function TipModal({ open, onOpenChange, creatorName }: TipModalProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const handleQuickTip = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleSendTip = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount && amount > 0) {
      // In a real app, this would process the payment
      console.log(`Sending $${amount} tip to ${creatorName}`, { message });
      onOpenChange(false);
      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      setMessage('');
    }
  };

  const currentAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
  const platformFee = currentAmount * 0.05; // 5% platform fee
  const creatorReceives = currentAmount - platformFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent className="max-w-md bg-gray-900 text-white border border-gray-700 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Dash Me a Tip</h2>
              <p className="text-sm text-gray-400">Support {creatorName}</p>
            </div>
          </div>
          
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Tip Amounts */}
          <div>
            <label className="block text-sm font-medium mb-3">Quick tip</label>
            <div className="grid grid-cols-4 gap-3">
              {quickTipAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickTip(amount)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAmount === amount
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-lg font-bold">${amount}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Custom amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-10"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          {/* Message (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">Message (optional)</label>
            <Input
              placeholder="Say something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/100</p>
          </div>

          {/* Breakdown */}
          {currentAmount > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Your tip</span>
                <span className="font-medium">${currentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platform fee (5%)</span>
                <span className="font-medium text-gray-400">-${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between">
                <span className="font-medium">{creatorName} receives</span>
                <span className="font-bold text-yellow-500">${creatorReceives.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSendTip}
            disabled={currentAmount <= 0}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
          >
            <Heart className="w-4 h-4 mr-2" />
            Send ${currentAmount > 0 ? currentAmount.toFixed(2) : '0.00'} Tip
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Tips are one-time payments that go directly to the creator's wallet after platform fees.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
