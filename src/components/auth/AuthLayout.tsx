import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sparkles, GraduationCap, BookOpen, Users, TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 dark:bg-blue-400/10 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Enhanced Dashboard Mockup */}
        <div className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10">
          {/* Header */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          
          {/* Sidebar */}
          <motion.div 
            className="absolute top-16 left-0 bottom-0 w-20 bg-gradient-to-b from-[#1B68B3] to-[#1a5da0] border-r border-[#1a5da0]/50"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Sidebar Icons */}
            <div className="flex flex-col items-center pt-6 space-y-4">
              <GraduationCap className="w-6 h-6 text-white/70" />
              <BookOpen className="w-6 h-6 text-white/70" />
              <Users className="w-6 h-6 text-white/70" />
              <TrendingUp className="w-6 h-6 text-white/70" />
            </div>
          </motion.div>
          
          {/* Enhanced Data Visualization */}
          <motion.div 
            className="absolute top-28 right-8 w-64 h-64"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Animated Chart Circle */}
            <div className="relative w-full h-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-blue-200 dark:text-blue-800"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-[#1B68B3]"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 113 }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1B68B3]">75%</div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Cards Grid */}
          <motion.div 
            className="grid grid-cols-3 gap-4 absolute left-24 top-24 right-80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-32 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm border border-gray-200/30 dark:border-gray-700/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-4 h-full flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500" />
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Enhanced Table */}
          <motion.div 
            className="absolute bottom-24 left-24 right-24 h-48 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/30 dark:border-gray-700/30 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="h-10 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/20" />
            <div className="p-3 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-2">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-100/70 dark:bg-gray-700/70 rounded" />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-blue-50/30 dark:from-gray-900/20 dark:via-transparent dark:to-gray-800/30" />
      </div>
      
      {/* Theme Toggle */}
      <motion.div 
        className="absolute top-6 right-6 z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ThemeToggle />
      </motion.div>
      
      {/* Enhanced Brand Logo */}
      <motion.div 
        className="absolute top-6 left-6 z-50 flex items-center gap-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
          <Sparkles className="w-5 h-5 text-[#1B68B3]" />
          <span className="font-bold text-[#1B68B3] text-lg">Ilmee</span>
        </div>
      </motion.div>
      
      {/* Enhanced Main Card with Tilted Effect */}
      <motion.div 
        className="relative z-40 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Enhanced Brand Card - Back */}
        <motion.div 
          className="absolute -left-6 -right-6 -top-6 -bottom-6 bg-gradient-to-br from-[#1B68B3] via-blue-500 to-indigo-600 rounded-2xl shadow-2xl transform -rotate-2 z-10"
          initial={{ rotate: -5, scale: 0.95 }}
          animate={{ rotate: -2, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
        </motion.div>
        
        {/* Enhanced Secondary Card - Middle */}
        <motion.div 
          className="absolute -left-3 -right-3 -top-3 -bottom-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl transform rotate-1 z-20 border border-blue-100/50 dark:border-blue-900/20"
          initial={{ rotate: -1, scale: 0.98 }}
          animate={{ rotate: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
        
        {/* Enhanced Main Content Card - Front */}
        <motion.div 
          className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg z-30 py-8 px-8 border border-gray-100/50 dark:border-gray-700/50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ 
            y: -2,
            transition: { duration: 0.2 }
          }}
        >
          {/* Enhanced Header */}
          <motion.div 
            className="text-center mb-6"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="inline-flex items-center justify-center mb-4">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-[#1B68B3] text-3xl font-bold flex items-center gap-2">
                  <Sparkles className="w-8 h-8" />
                  Ilmee
                </div>
                <motion.div
                  className="absolute -inset-2 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
            <motion.h1 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {title}
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>
          
          {/* Enhanced Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
