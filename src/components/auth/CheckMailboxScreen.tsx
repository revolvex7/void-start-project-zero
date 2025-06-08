import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckMailboxScreenProps {
  email: string;
  onContinue?: () => void;
  autoRedirectDelay?: number; // in seconds, default 8
}

export const CheckMailboxScreen: React.FC<CheckMailboxScreenProps> = ({
  email,
  onContinue,
  autoRedirectDelay = 8
}) => {
  const [countdown, setCountdown] = useState(autoRedirectDelay);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onContinue) {
            onContinue();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [onContinue]);

  useEffect(() => {
    // Stop the mail animation after a few seconds
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(animationTimer);
  }, []);

  const handleContinueNow = () => {
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
          {/* Animated Mail Icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mb-6"
          >
            <motion.div
              animate={{
                scale: isAnimating ? [1, 1.1, 1] : 1,
                rotate: isAnimating ? [0, -5, 5, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: isAnimating ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
            >
              <Mail className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </motion.div>
            
            {/* Success checkmark overlay */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
              className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
            >
              <CheckCircle className="h-5 w-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Check Your Mailbox
          </motion.h1>

          {/* Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-3 mb-6"
          >
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We've sent your login credentials to
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
              {email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please check your inbox and spam folder for the email with your login details.
            </p>
          </motion.div>

          {/* Auto-redirect info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span>Redirecting to login in {countdown} seconds</span>
            </div>
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <Button
              onClick={handleContinueNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Additional help text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-xs text-gray-400 dark:text-gray-500 mt-4 leading-relaxed"
          >
            Didn't receive the email? Check your spam folder or contact support if you need assistance.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}; 