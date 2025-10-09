import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

export function EmailVerificationModal({ open, onOpenChange, email = "zunebebanu@mailinator.com" }: EmailVerificationModalProps) {
  if (!open) return null;

  const handleResend = () => {
    // Handle resend logic here
    console.log('Resending verification email...');
  };

  const handleChangeEmail = () => {
    // Handle change email logic here
    console.log('Changing email address...');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="pr-8">
          <h2 className="text-xl font-bold text-white mb-4">Check your inbox</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              We sent a verification email to{' '}
              <span className="text-white font-medium">{email}</span>.
            </p>
            
            <p>
              Not seeing a verification email from no-reply@patreon.com? Double-check your spam 
              folder and review your{' '}
              <button className="text-blue-400 hover:text-blue-300 underline">
                email filters
              </button>.
            </p>
            
            <p>
              If you still don't see an email after several minutes, you can{' '}
              <button 
                onClick={handleResend}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                resend
              </button>{' '}
              the verification link or{' '}
              <button 
                onClick={handleChangeEmail}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                change your email address
              </button>.
            </p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-white text-black hover:bg-gray-100 px-6"
            >
              Okay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
