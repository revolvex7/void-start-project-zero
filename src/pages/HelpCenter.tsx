import React, { useState, useEffect } from "react";
import { 
  Search,
  BookOpen, 
  MessageCircle, 
  FileText, 
  HelpCircle,
  Info,
  ArrowRight,
  Mail,
  Phone,
  Clock,
  Star,
  Users,
  Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const HelpCenter = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("guides");

  const faqItems = [
    {
      question: "How do I create a new course?",
      answer: "Navigate to the Courses section, click on 'Create Course' button, fill in the course details such as title, description, and categories, then add modules and lessons as needed.",
      category: "courses"
    },
    {
      question: "How do I invite users to my domain?",
      answer: "Go to the Users page, click 'Add User', enter their email address and select their role. They will receive an invitation email to join your domain.",
      category: "users"
    },
    {
      question: "How can I customize my learning portal?",
      answer: "From the settings page, you can update your domain appearance, logo, colors, and other branding elements to match your organization's identity.",
      category: "settings"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual subscriptions. Contact our sales team for enterprise billing options.",
      category: "billing"
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login screen, enter your email address, and follow the instructions sent to your email to create a new password.",
      category: "account"
    },
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Ilmee",
      icon: BookOpen,
      color: "blue",
      articleCount: 12
    },
    {
      title: "Course Creation",
      description: "Build engaging learning experiences",
      icon: FileText,
      color: "purple",
      articleCount: 8
    },
    {
      title: "User Management",
      description: "Add and manage your users",
      icon: Users,
      color: "green",
      articleCount: 6
    },
    {
      title: "Billing & Subscription",
      description: "Manage your subscription and payments",
      icon: Settings,
      color: "orange",
      articleCount: 4
    }
  ];

  const guides = [
    {
      title: "Complete Guide to Course Creation",
      description: "Learn how to create engaging courses that keep your learners motivated",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400",
      minRead: "8",
      category: "Course Creation"
    },
    {
      title: "Effective User Management",
      description: "Best practices for organizing and managing your users and groups",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400",
      minRead: "6",
      category: "User Management"
    },
    {
      title: "Advanced Quiz Creation",
      description: "Create challenging assessments to test your learner's knowledge",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400",
      minRead: "5",
      category: "Assessment"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        iconBg: "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
        border: "border-blue-200 dark:border-blue-700"
      },
      purple: {
        iconBg: "bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
        border: "border-purple-200 dark:border-purple-700"
      },
      green: {
        iconBg: "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
        border: "border-green-200 dark:border-green-700"
      },
      orange: {
        iconBg: "bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
        border: "border-orange-200 dark:border-orange-700"
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const filterResults = (items) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.question?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo(0, 0);
  }, [activeTab]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Support Center</p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Find answers to common questions or contact our support team</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Search Knowledge Base
          </h2>
        </div>
        
        <div className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              className="pl-12 py-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 shadow-sm text-lg rounded-xl"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Browse by Category
          </h2>
        </div>
        
        <div className="p-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon;
              const colorClasses = getColorClasses(category.color);
              
              return (
                <motion.div key={index} variants={item}>
                  <div className={`p-6 bg-gradient-to-r ${colorClasses.gradient} rounded-xl border ${colorClasses.border} hover:shadow-md transition-all duration-200 cursor-pointer group`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses.iconBg}`}>
                        <IconComponent className={`h-6 w-6 ${colorClasses.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {category.articleCount} articles
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                      Browse articles
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Tabs with animation */}
      <Tabs 
        defaultValue="guides" 
        className="space-y-6"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl p-1 rounded-xl bg-slate-100 dark:bg-slate-700/50">
            <TabsTrigger 
              value="guides"
              className="rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-md transition-all duration-200"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger 
              value="faq"
              className="rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-md transition-all duration-200"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger 
              value="contact"
              className="rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-md transition-all duration-200"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="guides" className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Popular Guides</h2>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterResults(guides).map((guide, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden hover:shadow-lg transition-all duration-200 group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={guide.imageUrl} 
                          alt={guide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {guide.minRead} min read
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                            {guide.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          {guide.description}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                          Read guide
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {filterResults(faqItems).map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Methods */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Get in Touch</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Email Support</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Get help via email</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">support@ilmee.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Live Chat</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Chat with our support team</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Available 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Phone Support</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Speak with our experts</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Enterprise plans only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Support Hours</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Monday - Friday</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">9:00 AM - 6:00 PM PST</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Weekend</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Limited support via email</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Priority Support</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Get faster response times with our Pro and Enterprise plans.
                  </p>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
