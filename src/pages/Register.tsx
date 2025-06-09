import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; 
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AvatarUpload } from '@/components/auth/AvatarUpload';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { 
  UserPlus, 
  User,
  AtSign, 
  Lock, 
  Eye, 
  EyeOff, 
  Building,
  AlertCircle,
  Loader2,
  ExternalLink,
  CheckCircle,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingState } from '@/components/LoadingState';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<{ name: string; size: number; url: string } | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showCheckMailbox, setShowCheckMailbox] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{ domain: string; email: string } | null>(null);
  
  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } = useFormValidation({
    name: '',
    username: '',
    email: '',
    password: '',
    domainPrefix: '', 
    agreeTerms: false
  });

  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/onboarding/step1');
    }
  }, [isAuthenticated, navigate]);

  // Check form validity whenever values change
  useEffect(() => {
    const requiredFields = {
      name: values.name.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password.trim()
    };
    
    const allFieldsFilled = Object.values(requiredFields).every(value => value !== '');
    const termsAccepted = values.agreeTerms === true;
    
    setIsFormValid(allFieldsFilled && termsAccepted);
  }, [values]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm({
      name: { required: true, minLength: 2 },
      username: { required: true, minLength: 3 },
      email: { required: true, isEmail: true },
      password: { required: true, minLength: 6 },
      agreeTerms: { required: true }
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a custom domain by combining domainPrefix with base domain
      // Trim spaces and normalize domain prefix - convert to lowercase
      const domainPrefix = values.domainPrefix.trim().toLowerCase();
      // Use a default domain if domainPrefix is empty
      const domain = domainPrefix || 'ilmee';
      
      // Create registration data object
      const registrationData: {
        name: string;
        email: string;
        password: string;
        username: string;
        domain: string;
        profileImage?: string;
      } = {
        name: values.name, 
        email: values.email, 
        password: values.password, 
        username: values.username,
        domain: domain,
      };
      
      // Only add profileImage if it exists
      if (avatar) {
        console.log('🔍 Avatar object:', avatar);
        console.log('🔍 Avatar URL being extracted:', avatar.url);
        registrationData.profileImage = avatar.url;
        console.log('🔍 Registration data after adding profileImage:', registrationData);
      }
      
      const result = await register(
        registrationData.name,
        registrationData.email,
        registrationData.password,
        registrationData.username,
        registrationData.domain,
        registrationData.profileImage
      );
      
      if (result.success && result.domain) {
        toast.success('Account created successfully! Please check your email for the confirmation link.');
        
        // Set registration result with email from form values
        setRegistrationResult({ domain: result.domain, email: values.email });
        setShowCheckMailbox(true);
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      // Don't show generic error toast here since AuthContext handles specific API errors
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAvatarChange = (imageData: { name: string; size: number; url: string } | null) => {
    setAvatar(imageData);
  };

  const handleSwitchChange = (checked: boolean) => {
    setValues({
      ...values,
      agreeTerms: checked
    });
  };

  // Custom handler for domain prefix to prevent spaces and convert to lowercase
  const handleDomainPrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s+/g, '').toLowerCase();
    
    setValues({
      ...values,
      [name]: sanitizedValue
    });
  };

  // Enhanced focus handlers
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleEnhancedBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedField(null);
    handleBlur(e);
  };

  const handleContinueToLogin = () => {
    if (registrationResult) {
      const { domain } = registrationResult;
      
      // Redirect to the login page on the correct subdomain
      const hostname = window.location.hostname;
      
      // For development environments (localhost)
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Navigate to login with domain parameter for local development
        navigate(`/login?domain=${domain}`);
      } else {
        // For production environments, redirect to the subdomain
        const baseDomain = hostname.split('.').slice(-2).join('.');
        const subdomain = domain === 'ilmee' ? '' : `${domain}.`;
        const loginUrl = `${window.location.protocol}//${subdomain}${baseDomain}/login`;
        window.location.href = loginUrl;
      }
    }
  };

  const isLoading = isSubmitting || authLoading;

  if (isLoading) {
    return (
      <AuthLayout
        title="Creating your account"
        subtitle="Please wait while we set up your profile"
      >
        <LoadingState 
          message="Setting up your account" 
          progress={80} 
          statusMessage="Creating your profile" 
          className="py-8"
        />
      </AuthLayout>
    );
  }

  // Field validation status component
  const FieldStatus = ({ fieldName, value }: { fieldName: string; value: string }) => {
    const hasError = touched[fieldName as keyof typeof touched] && errors[fieldName as keyof typeof errors];
    const isValid = value && !hasError;
    
    return (
      <AnimatePresence>
        {isValid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-3 top-3"
          >
            <CheckCircle className="h-5 w-5 text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Join Ilmee to start your learning journey"
    >
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced Avatar Upload */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <AvatarUpload name={values.name} onChange={handleAvatarChange} />
        </motion.div>
        
        <div className="space-y-4">
          {/* Full Name Field */}
          <motion.div 
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="relative"
              animate={{
                scale: focusedField === 'name' ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <User className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
                focusedField === 'name' ? 'text-[#1B68B3]' : 'text-gray-500 dark:text-gray-400'
              }`} />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                className={`pl-10 pr-12 py-6 rounded-xl border transition-all duration-200 ${
                  focusedField === 'name' 
                    ? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
                value={values.name}
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={handleEnhancedBlur}
                disabled={isLoading}
              />
              <FieldStatus fieldName="name" value={values.name} />
            </motion.div>
            <AnimatePresence>
              {touched.name && errors.name && (
                <motion.div 
                  className="flex items-center gap-2 text-sm text-red-500"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.name}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Username Field */}
          <motion.div 
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div 
              className="relative"
              animate={{
                scale: focusedField === 'username' ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <User className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
                focusedField === 'username' ? 'text-[#1B68B3]' : 'text-gray-500 dark:text-gray-400'
              }`} />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                className={`pl-10 pr-12 py-6 rounded-xl border transition-all duration-200 ${
                  focusedField === 'username' 
                    ? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
                value={values.username}
                onChange={handleChange}
                onFocus={() => handleFocus('username')}
                onBlur={handleEnhancedBlur}
                disabled={isLoading}
              />
              <FieldStatus fieldName="username" value={values.username} />
            </motion.div>
            <AnimatePresence>
              {touched.username && errors.username && (
                <motion.div 
                  className="flex items-center gap-2 text-sm text-red-500"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.username}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Email Field */}
          <motion.div 
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="relative"
              animate={{
                scale: focusedField === 'email' ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AtSign className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
                focusedField === 'email' ? 'text-[#1B68B3]' : 'text-gray-500 dark:text-gray-400'
              }`} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className={`pl-10 pr-12 py-6 rounded-xl border transition-all duration-200 ${
                  focusedField === 'email' 
                    ? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
                value={values.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleEnhancedBlur}
                disabled={isLoading}
              />
              <FieldStatus fieldName="email" value={values.email} />
            </motion.div>
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.div 
                  className="flex items-center gap-2 text-sm text-red-500"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Password Field */}
          <motion.div 
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
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
                placeholder="Create a password"
                className={`pl-10 pr-12 py-6 rounded-xl border transition-all duration-200 ${
                  focusedField === 'password' 
                    ? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
                value={values.password}
                onChange={handleChange}
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
          
          {/* Domain Field */}
          <motion.div 
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div 
              className="relative"
              animate={{
                scale: focusedField === 'domainPrefix' ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Building className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
                focusedField === 'domainPrefix' ? 'text-[#1B68B3]' : 'text-gray-500 dark:text-gray-400'
              }`} />
              <div className="flex">
                <Input
                  id="domainPrefix"
                  name="domainPrefix"
                  type="text"
                  placeholder="yourcompany"
                  className={`pl-10 py-6 rounded-l-xl border transition-all duration-200 ${
                    focusedField === 'domainPrefix' 
                      ? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
                  value={values.domainPrefix}
                  onChange={handleDomainPrefixChange}
                  onFocus={() => handleFocus('domainPrefix')}
                  onBlur={handleEnhancedBlur}
                />
                <motion.div 
                  className={`inline-flex items-center px-4 border border-l-0 transition-all duration-200 ${
                    focusedField === 'domainPrefix' 
                      ? 'border-[#1B68B3] bg-blue-50 dark:bg-blue-950/20 text-[#1B68B3]' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  } rounded-r-xl`}
                  whileHover={{ scale: 1.02 }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  .ilmee.ai
                </motion.div>
              </div>
            </motion.div>
            {values.domainPrefix && (
              <motion.p 
                className="text-xs text-gray-500 dark:text-gray-400 ml-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Your platform will be available at: <span className="font-medium text-[#1B68B3]">{values.domainPrefix}.ilmee.ai</span>
              </motion.p>
            )}
          </motion.div>
          
          {/* Terms and Conditions */}
          <motion.div 
            className="pt-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div 
              className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Switch
                  id="terms"
                  checked={values.agreeTerms === true}
                  onCheckedChange={handleSwitchChange}
                  className="data-[state=checked]:bg-[#1B68B3] mt-0.5"
                />
              </motion.div>
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                I agree to the{' '}
                <motion.a 
                  href="#" 
                  className="text-[#1B68B3] hover:underline font-medium"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Terms of Service
                </motion.a>
                {' '}and{' '}
                <motion.a 
                  href="#" 
                  className="text-[#1B68B3] hover:underline font-medium"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Privacy Policy
                </motion.a>
              </label>
            </motion.div>
            <AnimatePresence>
              {touched.agreeTerms && errors.agreeTerms && (
                <motion.div 
                  className="flex items-center gap-2 text-sm text-red-500 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="h-4 w-4" />
                  <p>You must agree to the terms to continue</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Submit Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.div
            whileHover={isFormValid && !isLoading ? { scale: 1.02 } : {}}
            whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
          >
            <Button
              type="submit"
              className={`w-full py-6 font-medium rounded-xl transition-all duration-300 ${
                isFormValid && !isLoading
                  ? 'bg-gradient-to-r from-[#1B68B3] to-blue-600 hover:from-[#1A5DA0] hover:to-blue-700 shadow-lg shadow-blue-500/25'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              }`}
              disabled={isLoading || !isFormValid}
            >
              <motion.span 
                className="flex items-center justify-center"
                animate={isSubmitting ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0 }}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-5 w-5" />
                )}
                Create free account
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Sign In Link */}
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link 
                to="/login" 
                className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center transition-colors"
              >
                Sign in <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Register;
