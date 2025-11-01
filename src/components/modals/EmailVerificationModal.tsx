import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

export function EmailVerificationModal({ open, onOpenChange, email }: EmailVerificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Check your inbox</DialogTitle>
          <DialogDescription className="text-gray-300 space-y-4">
            <p className="text-base">
              We sent a verification email to{' '}
              <span className="text-white font-medium">{email || 'your email'}</span>.
            </p>
            
            <p className="text-base">
              Not seeing a verification email from info@truefans.ng? Double-check your spam 
              folder and review your{' '}
              <button className="text-blue-400 hover:text-blue-300 underline">
                email filters
              </button>.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-white text-black hover:bg-gray-100 px-8 py-2"
          >
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
