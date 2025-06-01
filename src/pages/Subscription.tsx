import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Info, CreditCard, Star, Zap, Shield, Crown } from "lucide-react";

const subscriptionPlans = [
  {
    id: "core",
    name: "Core",
    description: "Begin your e-learning journey with foundational tools for success",
    userRange: "1-40 users",
    monthlyPrice: 109,
    yearlyPrice: 1308, // 109 * 12
    yearlyDiscount: 262, // ~20% discount
    features: [
      "Everything in Free",
      "1 branch",
      "TalentCraft AI (5,000 credits)",
      "Unlimited courses",
      "Custom homepage",
      "API",
      "Single sign-on support",
      "Custom domain + SSL",
      "Basic reports"
    ],
    ilmeeLibraryCost: 32,
    icon: Zap,
    color: "blue"
  },
  {
    id: "grow",
    name: "Grow",
    description: "Strategize your learning with intuitive insights",
    userRange: "1-70 users",
    monthlyPrice: 229,
    yearlyPrice: 2748, // 229 * 12
    yearlyDiscount: 550, // ~20% discount
    features: [
      "Everything in Core",
      "3 branches",
      "TalentCraft AI premium (120,000 credits)",
      "Custom reports",
      "Onboarding Starter",
      "LTI 1.3 support"
    ],
    ilmeeLibraryCost: 53,
    recommended: true,
    icon: Star,
    color: "green"
  },
  {
    id: "pro",
    name: "Pro",
    description: "Everything you need to support training at scale",
    userRange: "1-100 users",
    monthlyPrice: 399,
    yearlyPrice: 4788, // 399 * 12
    yearlyDiscount: 958, // ~20% discount
    features: [
      "Everything in Grow",
      "15 branches",
      "TalentCraft AI premium (180,000 credits)",
      "Remove Ilmee branding",
      "Automations",
      "Live chat support",
      "Priority email support",
      "Skills"
    ],
    ilmeeLibraryCost: 70,
    flexibility: {
      name: "Flexible user limit",
      cost: 140
    },
    icon: Shield,
    color: "purple"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Create a custom annual plan that fits your requirements",
    userRange: "Unlimited users",
    price: "Custom",
    features: [
      "Unlimited branches",
      "TalentCraft AI premium (1,000,000 credits)",
      "Phone support",
      "Account manager",
      "Onboarding Premium"
    ],
    ilmeeLibrary: true,
    enterprise: true,
    icon: Crown,
    color: "orange"
  }
];

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [includeIlmeeLibrary, setIncludeIlmeeLibrary] = useState(false);
  const [includeFlexibleUsers, setIncludeFlexibleUsers] = useState(false);
  
  const getPlanPrice = (plan) => {
    if (plan.enterprise) return "Custom";
    
    let price = billingCycle === "monthly" ? plan.monthlyPrice : (plan.yearlyPrice - plan.yearlyDiscount);
    
    // Add IlmeeLibrary cost if selected
    if (includeIlmeeLibrary && plan.ilmeeLibraryCost) {
      price += plan.ilmeeLibraryCost;
    }
    
    // Add flexible user limit cost if selected
    if (includeFlexibleUsers && plan.flexibility && plan.id === "pro") {
      price += plan.flexibility.cost;
    }
    
    return `$${price}`;
  };
  
  const getSavingsText = (plan) => {
    if (plan.enterprise || billingCycle !== "annually") return null;
    return `Save $${plan.yearlyDiscount}/year`;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        iconBg: "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-500",
        border: "border-blue-200 dark:border-blue-700",
        gradient: "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
      },
      green: {
        iconBg: "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        badge: "bg-green-500",
        border: "border-green-200 dark:border-green-700",
        gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
      },
      purple: {
        iconBg: "bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        badge: "bg-purple-500",
        border: "border-purple-200 dark:border-purple-700",
        gradient: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"
      },
      orange: {
        iconBg: "bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-500",
        border: "border-orange-200 dark:border-orange-700",
        gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
      }
    };
    return colorMap[color] || colorMap.blue;
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Subscription Management</p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Select the perfect plan for your organization's learning needs</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Current Subscription
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                My current plan: <span className="text-blue-600 dark:text-blue-400 font-semibold">Free</span> | 5 users
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Usage summary: 4/5 users, 4/10 courses, 0 branches
              </p>
            </div>
            <Button 
              variant="outline"
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Subscription options
            </Button>
          </div>
        </div>
      </div>

      {/* Billing Options and Warning */}
      <div className="space-y-4">
        {/* Warning Alert */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              You're about to reach the limit of your current plan. Upgrade now to unlock more features.
            </p>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <Tabs defaultValue="monthly" value={billingCycle} onValueChange={setBillingCycle} className="w-[280px]">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
              <TabsTrigger 
                value="monthly"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm transition-all duration-200"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="annually"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm transition-all duration-200"
              >
                Annually 
                <Badge className="ml-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5">
                  -20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map(plan => {
          const IconComponent = plan.icon;
          const colorClasses = getColorClasses(plan.color);
          
          return (
            <div 
              key={plan.id} 
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 ${
                plan.recommended ? 'ring-2 ring-green-500 dark:ring-green-400 scale-105' : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2 text-xs font-medium">
                  ⭐ RECOMMENDED
                </div>
              )}
              
              <div className={`px-6 pt-6 pb-4 ${plan.enterprise ? 'bg-gradient-to-r ' + colorClasses.gradient : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses.iconBg}`}>
                    <IconComponent className={`h-6 w-6 ${colorClasses.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{plan.userRange}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{plan.description}</p>
              </div>
              
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="outline" 
                    className={`${colorClasses.border} bg-gradient-to-r ${colorClasses.gradient}`}
                  >
                    {billingCycle === "monthly" ? "Monthly" : "Annually"}
                  </Badge>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {getPlanPrice(plan)}
                    </span>
                    {!plan.enterprise && (
                      <span className="text-slate-600 dark:text-slate-400 text-sm">
                        {billingCycle === "monthly" ? "/month" : "/year"}
                      </span>
                    )}
                  </div>
                  {getSavingsText(plan) && (
                    <div className="text-green-600 dark:text-green-400 text-sm mt-1 font-medium">
                      {getSavingsText(plan)}
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.recommended 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg' 
                      : plan.enterprise
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  } transition-all duration-200`}
                  size="lg"
                >
                  {plan.enterprise ? 'Contact Sales' : 'Choose Plan'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add-ons Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Add-ons & Extras
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">IlmeeLibrary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Access to premium content library</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeIlmeeLibrary}
                  onChange={(e) => setIncludeIlmeeLibrary(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${includeIlmeeLibrary ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${includeIlmeeLibrary ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`} />
                </div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Flexible User Limit</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Remove user restrictions</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFlexibleUsers}
                  onChange={(e) => setIncludeFlexibleUsers(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${includeFlexibleUsers ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${includeFlexibleUsers ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`} />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">What happens when I upgrade?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your new features will be available immediately, and you'll be charged prorated for the remainder of your billing period.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Can I change plans anytime?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
