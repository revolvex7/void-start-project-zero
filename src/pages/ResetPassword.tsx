import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingState } from '@/components/LoadingState';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Get token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || '';
  
  const { values, errors, touched, handleChange, handleBlur, validateForm, setErrors } = useFormValidation({
    password: '',
    confirmPassword: '',
  });

  // Custom validation function to check if passwords match
  const validatePasswordMatch = () => {
    const newErrors = { ...errors };
    
    if (values.confirmPassword && values.password !== values.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else {
      delete newErrors.confirmPassword;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields using the standard validation
    const isValid = validateForm({
      password: { required: true, minLength: 6 },
      confirmPassword: { required: true },
    });
    
    // Additionally check if passwords match
    const passwordsMatch = validatePasswordMatch();
    
    if (!isValid || !passwordsMatch) return;
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await resetPassword(token, values.password);
      
      if (success) {
        setResetSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Enhanced focus handlers
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleEnhancedBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedField(null);
    handleBlur(e);
    // Additional validation for confirm password when blurring
    if (e.target.name === 'confirmPassword') {
      validatePasswordMatch();
    }
  };

  // Field validation status component
  const FieldStatus = ({ fieldName, value }: { fieldName: string; value: string }) => {
    const hasError = touched[fieldName as keyof typeof touched] && errors[fieldName as keyof typeof errors];
    const isValid = value && !hasError && (fieldName !== 'confirmPassword' || values.password === values.confirmPassword);
    
    return (
      <AnimatePresence>
        {isValid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-10 top-3"
          >
            <CheckCircle className="h-5 w-5 text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const isLoading = isSubmitting || authLoading;

  if (isLoading) {
    return (
      <AuthLayout
        title="Resetting your password"
        subtitle="Please wait while we update your account"
      >
        <LoadingState 
          message="Updating your password" 
          progress={75} 
          statusMessage="Applying security changes" 
          className="py-8"
        />
      </AuthLayout>
    );
  }

  if (resetSuccess) {
    return (
      <AuthLayout
        title="Password Reset Complete"
        subtitle="Your password has been updated successfully"
      >
        <motion.div 
          className="text-center space-y-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <motion.div
                className="absolute -inset-2 bg-green-400/20 dark:bg-green-400/10 rounded-full blur-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Your password has been reset successfully. You will be redirected to the login page.
            </p>
          </motion.div>
          
          <motion.div 
            className="pt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.span
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link 
                to="/login" 
                className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center transition-colors bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to login
              </Link>
            </motion.span>
          </motion.div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Your Password" 
      subtitle="Create a new password for your account"
    >
      {!token ? (
        <motion.div 
          className="text-center space-y-4 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Invalid Reset Link</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This password reset link is invalid or has expired.
            </p>
          </motion.div>
          
          <motion.div 
            className="pt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link 
                to="/forgot-password" 
                className="text-[#1B68B3] hover:text-blue-600 font-medium transition-colors"
              >
                Request a new reset link
              </Link>
            </motion.span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            {/* New Password Field */}
            <motion.div 
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div 
                className="relative"
                animate={{
                  scale: focusedField === 'password' ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Lock className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-[#1B68B3]' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  className={`pl-10 pr-20 py-6 rounded-xl border transition-all duration-200 ${
                    focusedField === 'password' 
                      ? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
                  value={values.password}
                  onChange={(e) => {
                    handleChange(e);
                    if (values.confirmPassword) {
                      validatePasswordMatch();
                    }
                  }}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleEnhancedBlur}
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={toggleShowPassword}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
                <FieldStatus fieldName="password" value={values.password} />
              </motion.div>

              <AnimatePresence>
                {values.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PasswordStrength password={values.password} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {touched.password && errors.password && (
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <p>{errors.password}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div 
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className="relative"
                animate={{
                  scale: focusedField === 'confirmPassword' ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Lock className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
                  focusedField === 'confirmPassword' ? 'text-[#1B68B3]' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className={`pl-10 pr-20 py-6 rounded-xl border transition-all duration-200 ${
                    focusedField === 'confirmPassword' 
                      ? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
                  value={values.confirmPassword}
                  onChange={(e) => {
                    handleChange(e);
                    validatePasswordMatch();
                  }}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleEnhancedBlur}
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={toggleShowConfirmPassword}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
                <FieldStatus fieldName="confirmPassword" value={values.confirmPassword} />
              </motion.div>
              
              <AnimatePresence>
                {touched.confirmPassword && errors.confirmPassword && (
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <p>{errors.confirmPassword}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Submit Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-[#1B68B3] to-blue-600 hover:from-[#1A5DA0] hover:to-blue-700 transition-all duration-300 font-medium rounded-xl shadow-lg shadow-blue-500/25"
                disabled={isLoading}
              >
                <motion.span 
                  className="flex items-center justify-center"
                  animate={isSubmitting ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0 }}
                >
                  <KeyRound className="mr-2 h-5 w-5" />
                  Reset Password
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Back to Login Link */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link 
                  to="/login" 
                  className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center transition-colors"
                >
                  Sign in <ArrowLeft className="ml-1 h-3 w-3 rotate-180" />
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </motion.form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
