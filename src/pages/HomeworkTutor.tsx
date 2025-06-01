import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  Image as ImageIcon, 
  Upload, 
  User, 
  Camera,
  BookOpen,
  Lightbulb,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: string;
}

const HomeworkTutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi there! I'm your Homework Tutor AI! 🤖✨ I'm here to help you with any questions you have about your homework. You can ask me anything or even upload a picture of a problem you're stuck on. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size should be less than 10MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateAIResponse = (userMessage: string, hasImage: boolean): string => {
    // This is a mock AI response - in a real implementation, you'd call an AI API
    if (hasImage) {
      return "I can see the image you've uploaded! 📸 That looks like a math problem. Let me help you solve it step by step:\n\n1. First, let's identify what we're looking for\n2. Then we'll break down the problem into smaller parts\n3. Finally, we'll solve it together!\n\nCan you tell me which specific part you're having trouble with? I'm here to guide you through each step! 😊";
    }
    
    const responses = [
      "Great question! Let me help you understand this concept step by step. 📚 First, let's break down what we're dealing with...",
      "I love helping with homework! 🌟 Let me explain this in a way that's easy to understand...",
      "That's a really good question! 🤔 Let me walk you through this problem together...",
      "Excellent! I can definitely help you with that. Let's start by understanding the basics...",
      "Don't worry, we'll figure this out together! 💪 Let me give you some hints to get started..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || "I uploaded an image. Can you help me with this?",
      timestamp: new Date(),
      image: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: simulateAIResponse(inputMessage, !!selectedImage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      removeImage();
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Help me with math homework",
    "Explain this science concept",
    "Check my essay grammar",
    "History question help"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-8 w-8" />
            </div>
            Homework Tutor AI
          </CardTitle>
          <p className="text-purple-100 text-lg">
            Get instant help with your homework! Ask questions or upload images of problems you need help with.
          </p>
        </CardHeader>
      </Card>

      {/* Quick Question Buttons */}
      {messages.length === 1 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Quick Questions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => setInputMessage(question)}
                >
                  <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  message.type === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.type === 'user' 
                    ? "bg-blue-500 text-white" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                )}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div className={cn(
                  "rounded-lg p-3 space-y-2",
                  message.type === 'user'
                    ? "bg-blue-500 text-white ml-2"
                    : "bg-muted mr-2"
                )}>
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Uploaded homework" 
                      className="max-w-full h-auto rounded-lg border"
                    />
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <div className={cn(
                    "text-xs opacity-70",
                    message.type === 'user' ? "text-blue-100" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3 mr-2">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-32 rounded-lg border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeImage}
              >
                ×
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <div className="flex-1 relative">
              <Textarea
                placeholder="Ask me anything about your homework or upload an image..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="resize-none min-h-[60px] pr-12"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
                className="absolute bottom-2 right-2 h-8 w-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                Press Enter to send
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Camera className="h-3 w-3" />
                Upload images up to 10MB
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeworkTutor; 