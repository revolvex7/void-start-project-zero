
import React, { useState } from "react";
import { 
  Search,
  BookOpen, 
  MessageCircle, 
  FileText, 
  HelpCircle,
  Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useAuth } from "@/context/AuthContext";

const HelpCenter = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      question: "How do I create a new course?",
      answer: "Navigate to the Courses section, click on 'Create Course' button, fill in the course details such as title, description, and categories, then add modules and lessons as needed."
    },
    {
      question: "How do I invite users to my domain?",
      answer: "Go to the Users page, click 'Add User', enter their email address and select their role. They will receive an invitation email to join your domain."
    },
    {
      question: "How can I customize my learning portal?",
      answer: "From the settings page, you can update your domain appearance, logo, colors, and other branding elements to match your organization's identity."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual subscriptions. Contact our sales team for enterprise billing options."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login screen, enter your email address, and follow the instructions sent to your email to create a new password."
    },
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Ilmee",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      title: "Course Creation",
      description: "Build engaging learning experiences",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      title: "User Management",
      description: "Add and manage your users",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      title: "Billing & Subscription",
      description: "Manage your subscription and payments",
      icon: <Info className="h-6 w-6" />,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
    }
  ];

  const guides = [
    {
      title: "Complete Guide to Course Creation",
      description: "Learn how to create engaging courses that keep your learners motivated",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400",
      minRead: "8"
    },
    {
      title: "Effective User Management",
      description: "Best practices for organizing and managing your users and groups",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400",
      minRead: "6"
    },
    {
      title: "Advanced Quiz Creation",
      description: "Create challenging assessments to test your learner's knowledge",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400",
      minRead: "5"
    }
  ];

  const filterResults = (items) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.question?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 p-8 mb-8 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-center mb-2">Help Center</h1>
            <p className="text-center text-muted-foreground mb-6 max-w-md mx-auto">
              Find answers to common questions or contact our support team for assistance
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 py-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="guides" className="mb-8">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
              {helpCategories.map((category, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className={`${category.color} p-4 flex flex-row items-center gap-3`}>
                    <div className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-md">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription className="text-foreground/80">
                        {category.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Popular Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={guide.imageUrl} 
                      alt={guide.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{guide.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{guide.description}</p>
                    <p className="text-xs text-muted-foreground">{guide.minRead} min read</p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4">
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {filterResults(faqItems).map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-muted/30 p-4 rounded-md">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filterResults(faqItems).length === 0 && (
                <div className="text-center py-12 border border-dashed rounded-md">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find any questions matching your search.
                    <br />Try using different keywords or contact support.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="contact">
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <CardHeader>
                    <CardTitle>Email Support</CardTitle>
                    <CardDescription>Reach out to our support team via email</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Our support team typically responds within 24 hours during business days.</p>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          support@ilmee.ai
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Contact email copied!</h4>
                          <p className="text-sm">
                            Click to copy our support email address to your clipboard.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
                  <CardHeader>
                    <CardTitle>Live Chat</CardTitle>
                    <CardDescription>Chat with our support representatives</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Available Monday to Friday, 9 AM to 5 PM EST.</p>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Start Live Chat
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Submit a Request</CardTitle>
                  <CardDescription>Send us a detailed message about your issue</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          defaultValue={user?.name || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your.email@example.com" 
                          defaultValue={user?.email || ""}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input id="subject" placeholder="Brief description of your issue" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea 
                        id="message" 
                        rows={5} 
                        className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">Submit Request</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;
