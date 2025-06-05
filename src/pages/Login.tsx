import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useFormValidation } from "@/hooks/useFormValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
	LogIn,
	Mail,
	Lock,
	Eye,
	EyeOff,
	AlertCircle,
	Loader2,
	ExternalLink,
	AtSign,
	User,
	CheckCircle,
	Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { LoadingState } from "@/components/LoadingState";

const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, isLoading: authLoading, isAuthenticated } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	// Extract subdomain from URL
	const getSubdomainFromUrl = () => {
		const hostname = window.location.hostname;
		// Check if we're on localhost (for development)
		if (hostname === "localhost" || hostname === "127.0.0.1") {
			// Try to get subdomain from URL parameters for local development
			const searchParams = new URLSearchParams(location.search);
			return searchParams.get("domain") || "ilmee";
		}

		// For production, extract from hostname
		const parts = hostname.split(".");
		if (parts.length > 2) {
			return parts[0];
		}
		return "ilmee"; // Default domain
	};

	const defaultDomain = getSubdomainFromUrl();

	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		validateForm,
		setValues,
	} = useFormValidation({
		emailOrUsername: "",
		password: "",
		domain: defaultDomain,
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		// Try to get saved email from localStorage
		const savedEmail = localStorage.getItem("lastLoginEmail");

		if (savedEmail) {
			setValues((prev) => ({ ...prev, emailOrUsername: savedEmail }));
		}

		// Set the domain from URL/subdomain
		setValues((prev) => ({ ...prev, domain: defaultDomain }));

		// Update document title with subdomain
		if (defaultDomain && defaultDomain !== "ilmee") {
			document.title = `${defaultDomain} | Ilmee`;
		}
	}, [setValues, defaultDomain]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const isValid = validateForm({
			emailOrUsername: { required: true },
			password: { required: true },
		});

		if (!isValid) return;

		setIsSubmitting(true);

		try {
			// Save email for next login if remember me is checked
			if (rememberMe) {
				localStorage.setItem("lastLoginEmail", values.emailOrUsername);
			}

			// Always use the domain from the URL/subdomain
			const loginDomain = defaultDomain;

			const success = await login(
				values.emailOrUsername,
				values.password,
				loginDomain
			);

			if (success) {
				// After successful login, redirect to the proper subdomain
				const userDomain = localStorage.getItem("userDomain") || "ilmee";

				if (
					window.location.hostname !== "localhost" &&
					window.location.hostname !== "127.0.0.1" &&
					!window.location.hostname.startsWith(`${userDomain}.`)
				) {
					// Get base domain (e.g., ilmee.com)
					const parts = window.location.hostname.split(".");
					const baseDomain =
						parts.length > 1
							? parts.slice(-2).join(".")
							: window.location.hostname;

					// Redirect to subdomain
					window.location.href = `${window.location.protocol}//${userDomain}.${baseDomain}/`;
				} else {
					
					navigate("/");
				}
			}
		} catch (error) {
			console.error("Login submission error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	// Enhanced focus handlers
	const handleFocus = (fieldName: string) => {
		setFocusedField(fieldName);
	};

	const handleEnhancedBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setFocusedField(null);
		handleBlur(e);
	};

	const getInputIcon = () => {
		const iconClass = `absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${
			focusedField === 'emailOrUsername' ? 'text-[#1B68B3]' : 'text-gray-500 dark:text-gray-400'
		}`;
		
		if (values.emailOrUsername && values.emailOrUsername.includes("@")) {
			return <AtSign className={iconClass} />;
		}
		return <User className={iconClass} />;
	};

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

	const isLoading = isSubmitting || authLoading;

	if (isLoading) {
		return (
			<AuthLayout
				title="Signing you in"
				subtitle="Please wait while we verify your credentials"
			>
				<LoadingState
					message="Authenticating..."
					progress={70}
					statusMessage="Verifying your credentials"
					className="py-8"
				/>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Welcome back"
			subtitle={`Sign in to continue to your ${
				defaultDomain !== "ilmee" ? defaultDomain : ""
			} dashboard`}
		>
			<motion.form 
				onSubmit={handleSubmit} 
				className="space-y-5"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="space-y-4">
					{/* Email/Username Field */}
					<motion.div 
						className="space-y-2"
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<motion.div 
							className="relative"
							animate={{
								scale: focusedField === 'emailOrUsername' ? 1.02 : 1,
							}}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						>
							{getInputIcon()}
							<Input
								id="emailOrUsername"
								name="emailOrUsername"
								type="text"
								placeholder="Email or username"
								className={`pl-10 pr-12 py-6 rounded-xl border transition-all duration-200 ${
									focusedField === 'emailOrUsername' 
										? 'border-[#1B68B3] ring-2 ring-[#1B68B3]/20 bg-blue-50/50 dark:bg-blue-950/20' 
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
								} focus:ring-2 focus:ring-[#1B68B3]/20 focus:border-[#1B68B3] focus:outline-none`}
								value={values.emailOrUsername}
								onChange={handleChange}
								onFocus={() => handleFocus('emailOrUsername')}
								onBlur={handleEnhancedBlur}
								disabled={isLoading}
							/>
							<FieldStatus fieldName="emailOrUsername" value={values.emailOrUsername} />
						</motion.div>
						<AnimatePresence>
							{touched.emailOrUsername && errors.emailOrUsername && (
								<motion.div 
									className="flex items-center gap-2 text-sm text-red-500"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									<AlertCircle className="h-4 w-4" />
									<p>{errors.emailOrUsername}</p>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>

					{/* Password Field */}
					<motion.div 
						className="space-y-2"
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
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
								placeholder="Password"
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
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</motion.button>
						</motion.div>
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

					{/* Domain field is now hidden as we get it from the URL */}
					<input type="hidden" name="domain" value={defaultDomain} />

					{/* Remember Me and Forgot Password */}
					<motion.div 
						className="flex items-center justify-between pt-2"
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<motion.div 
							className="flex items-center"
							whileHover={{ scale: 1.02 }}
						>
							<Checkbox
								id="remember"
								checked={rememberMe}
								onCheckedChange={(checked) => setRememberMe(checked === true)}
								className="h-4 w-4 rounded border-gray-300 text-[#1B68B3] focus:ring-[#1B68B3]"
							/>
							<label
								htmlFor="remember"
								className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
							>
								Remember me
							</label>
						</motion.div>
						<div className="text-sm">
							<motion.span
								whileHover={{ scale: 1.05 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								<Link
									to="/forgot-password"
									className="font-medium text-[#1B68B3] hover:text-blue-600 transition-colors"
								>
									Forgot password?
								</Link>
							</motion.span>
						</div>
					</motion.div>
				</div>

				{/* Submit Button */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.4 }}
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
								{isSubmitting ? (
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								) : (
									<LogIn className="mr-2 h-5 w-5" />
								)}
								Sign in
							</motion.span>
						</Button>
					</motion.div>
				</motion.div>

				{/* Create Account Link */}
				<motion.div 
					className="text-center mt-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					<p className="text-gray-600 dark:text-gray-400">
						Don't have an account?{" "}
						<motion.span
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 400 }}
						>
							<Link
								to="/register"
								className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center transition-colors"
							>
								Create account <ExternalLink className="ml-1 h-3 w-3" />
							</Link>
						</motion.span>
					</p>
				</motion.div>
			</motion.form>
		</AuthLayout>
	);
};

export default Login;
// http://localhost:8080/course/fb23d28f-f558-4b78-a0c9-920a614833fa/preview