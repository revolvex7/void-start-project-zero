
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Settings, 
  CheckCircle, 
  X, 
  Send, 
  Users, 
  Upload, 
  Eye, 
  Edit,
  FileText,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { useSocketProgress } from "@/hooks/useSocketProgress";
import { Badge } from "@/components/ui/badge";

interface SlideData {
  slideNo: number;
  slideTitle: string;
  content: string;
  voiceScript: string;
  visualPrompt: string;
  example: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface QuizQuestion {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
}

interface GeneratedClassData {
  classNo: number;
  classId: string;
  classTitle: string;
  concepts: string[];
  slides: SlideData[];
  faqs: FAQ[];
  quizzes: QuizQuestion[];
}

const CourseEditor: React.FC = () => {
	const { courseId } = useParams<{ courseId: string }>();
	const navigate = useNavigate();
	const [courseName, setCourseName] = useState("Loading course...");
	const [isPublishing, setIsPublishing] = useState(false);
	const [generatedClasses, setGeneratedClasses] = useState<GeneratedClassData[]>([]);

	// Get socket connection for real-time updates - prevent disconnection by setting dependencies to []
	const { socket, isConnected, progressData } = useSocketProgress();

	// Listen for socket events for course generation
	useEffect(() => {
		if (!socket || !isConnected) {
			console.log("Socket not connected in CourseEditor, waiting...");
			return;
		}
		
		console.log("Setting up class_data listener in CourseEditor");
		
		// Listen for class data generation
		socket.on('class_data', (data: GeneratedClassData) => {
			console.log("Received class data:", data);
			
			setGeneratedClasses(prev => {
				// Check if we already have this class (prevent duplicates)
				const exists = prev.some(c => c.classId === data.classId);
				if (exists) {
					return prev;
				}
				return [...prev, data];
			});
			
			toast.success(`Class ${data.classNo} generated`, {
				description: data.classTitle
			});
		});
		
		return () => {
			// Only remove the event listener, but don't disconnect the socket
			if (socket) {
				console.log("Removing class_data listener");
				socket.off('class_data');
			}
		};
	}, [socket, isConnected]);

	// Fetch basic course data just to get the name
	useEffect(() => {
		if (!courseId) return;
		
		// Just fetch the course name from a lightweight API endpoint or local storage if available
		// For now, we'll just use a placeholder
		setCourseName("AI-Powered Machine Learning Course");
	}, [courseId]);

	const handlePublishCourse = () => {
		setIsPublishing(true);
		
		setTimeout(() => {
			setIsPublishing(false);
			toast.success("Course published successfully", {
				description: "Your course is now available to enrolled students"
			});
		}, 1500);
	};

	const calculateProgress = (): number => {
		// If we have socket progress, use that
		if (progressData.status !== 'idle') {
			const match = progressData.progress.match(/(\d+)%/);
			if (match && match[1]) {
				return parseInt(match[1], 10);
			}
		}
		
		// Otherwise calculate based on generated classes
		if (generatedClasses.length === 0) return 5;
		// Assume we'll have 5 classes total
		return Math.min(95, Math.floor((generatedClasses.length / 5) * 100));
	};

	return (
		<div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
			{/* Custom sidebar for course editing */}
			<div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
				<div className="p-5 border-b border-slate-200 dark:border-slate-700">
					<Link 
						to="/courses"
						className="flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 mb-4"
					>
						<ArrowLeft className="h-4 w-4 mr-1" />
						Back to courses
					</Link>
					<h1 className="text-xl font-bold text-slate-900 dark:text-white">
						{courseName}
					</h1>
					<p className="text-xs text-slate-500 mt-1">
						Course being generated
					</p>
				</div>
				
				<div className="p-4">
					<Button 
						className="w-full mb-2" 
						onClick={handlePublishCourse}
						disabled={isPublishing || generatedClasses.length === 0}
					>
						{isPublishing ? (
							<Spinner size="sm" className="mr-2" />
						) : (
							<CheckCircle className="h-4 w-4 mr-2" />
						)}
						{isPublishing ? "Publishing..." : "Publish Course"}
					</Button>
					
					<div className="flex space-x-2 mb-4">
						<Button variant="outline" size="sm" className="flex-1">
							<Eye className="h-4 w-4 mr-1" />
							Preview
						</Button>
						<Button variant="outline" size="sm" className="flex-1">
							<Settings className="h-4 w-4 mr-1" />
							Settings
						</Button>
					</div>
				</div>
				
				<Separator />
				
				<div className="flex-1 overflow-auto p-4">
					<h2 className="text-sm font-medium mb-2 text-slate-500">Course Content</h2>
					
					{generatedClasses.length > 0 ? (
						<div className="space-y-1">
							{generatedClasses.map((classData, index) => (
								<div 
									key={index} 
									className="text-sm py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between group"
								>
									<span className="truncate">
										<span className="text-slate-500">
											{index + 1}.{" "}
										</span>
										{classData.classTitle}
									</span>
									<Button 
										variant="ghost" 
										size="icon" 
										className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<Edit className="h-3.5 w-3.5" />
									</Button>
								</div>
							))}
						</div>
					) : (
						<div className="text-center text-sm text-slate-500 mt-4">
							Waiting for generated classes...
						</div>
					)}
				</div>
				
				{socket && isConnected && progressData.status !== 'idle' && (
					<div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium">Generating content</span>
							<span className="text-xs">{progressData.progress}</span>
						</div>
						<Progress value={parseInt(progressData.progress) || 0} className="h-1" />
					</div>
				)}
			</div>

			{/* Main content area */}
			<div className="flex-1 overflow-y-auto">
				<header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
					<div className="flex items-center justify-between h-16 px-6">
						<h1 className="text-xl font-semibold text-slate-900 dark:text-white">
							Course Editor
						</h1>
						<div className="flex items-center space-x-3">
							<Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
								Auto-saving
							</Badge>
							<Button size="sm">
								<Send className="h-4 w-4 mr-2" />
								Share
							</Button>
						</div>
					</div>
				</header>

				<div className="max-w-5xl mx-auto p-6">
					<div className="mb-6">
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
							Generated Course Content
						</h2>
						<p className="text-slate-500 dark:text-slate-400">
							Your course is being generated. Classes will appear here as they become available.
						</p>
					</div>

					{/* Generated classes section */}
					{generatedClasses.length > 0 ? (
						<div className="space-y-8">
							{generatedClasses.map((classData, index) => (
								<Card key={index} className="overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
									<div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
										<div className="flex items-center justify-between">
											<div>
												<span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full mb-2">
													Class {classData.classNo}
												</span>
												<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
													{classData.classTitle}
												</h3>
											</div>
											<Button size="sm" variant="outline">
												<Edit className="h-3.5 w-3.5 mr-1" />
												Edit
											</Button>
										</div>
										
										<div className="flex flex-wrap gap-2 mt-3">
											{classData.concepts.map((concept, i) => (
												<span 
													key={i} 
													className="px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full"
												>
													{concept}
												</span>
											))}
										</div>
									</div>
									
									<CardContent className="p-6">
										<h4 className="text-sm font-medium text-slate-500 mb-3">
											Slides ({classData.slides.length})
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
											{classData.slides.slice(0, 4).map((slide, i) => (
												<div key={i} className="border rounded-lg p-3 bg-white dark:bg-slate-800">
													<div className="flex justify-between items-center mb-2">
														<span className="text-xs font-medium text-slate-500">Slide {slide.slideNo}</span>
														<Button variant="ghost" size="icon" className="h-6 w-6">
															<Eye className="h-3.5 w-3.5" />
														</Button>
													</div>
													<h5 className="font-medium text-sm mb-1">{slide.slideTitle}</h5>
													<p className="text-xs text-slate-500 line-clamp-2">{slide.content.substring(0, 100)}...</p>
												</div>
											))}
											{classData.slides.length > 4 && (
												<div className="border border-dashed rounded-lg flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50">
													<span className="text-sm text-slate-500">+{classData.slides.length - 4} more slides</span>
												</div>
											)}
										</div>
										
										{classData.faqs.length > 0 && (
											<>
												<h4 className="text-sm font-medium text-slate-500 mb-3">
													FAQs ({classData.faqs.length})
												</h4>
												<div className="space-y-3 mb-6">
													{classData.faqs.slice(0, 2).map((faq, i) => (
														<div key={i} className="border rounded-lg p-3 bg-white dark:bg-slate-800">
															<h5 className="font-medium text-sm mb-1">{faq.question}</h5>
															<p className="text-xs text-slate-500 line-clamp-2">{faq.answer.substring(0, 100)}...</p>
														</div>
													))}
													{classData.faqs.length > 2 && (
														<div className="border border-dashed rounded-lg flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50">
															<span className="text-sm text-slate-500">+{classData.faqs.length - 2} more FAQs</span>
														</div>
													)}
												</div>
											</>
										)}
										
										{classData.quizzes.length > 0 && (
											<>
												<h4 className="text-sm font-medium text-slate-500 mb-3">
													Quiz Questions ({classData.quizzes.length})
												</h4>
												<div className="space-y-3">
													{classData.quizzes.slice(0, 2).map((quiz, i) => (
														<div key={i} className="border rounded-lg p-3 bg-white dark:bg-slate-800">
															<h5 className="font-medium text-sm mb-1">{quiz.question}</h5>
															<div className="text-xs text-slate-500">
																<div>A: {quiz.option1}</div>
																<div>B: {quiz.option2}</div>
																<div>C: {quiz.option3}</div>
																<div>D: {quiz.option4}</div>
															</div>
														</div>
													))}
													{classData.quizzes.length > 2 && (
														<div className="border border-dashed rounded-lg flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50">
															<span className="text-sm text-slate-500">+{classData.quizzes.length - 2} more questions</span>
														</div>
													)}
												</div>
											</>
										)}
									</CardContent>
								</Card>
							))}
							
							{/* Beautiful loading indicator for next class generation */}
							<div className="flex items-center justify-center py-12 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/30">
								<div className="text-center">
									<div className="relative inline-flex mb-4">
										<div className="absolute inset-0 rounded-full animate-ping bg-blue-200 dark:bg-blue-500/20 opacity-75"></div>
										<Spinner className="relative z-10" size="lg" />
									</div>
									<h3 className="text-md font-medium mb-2 text-slate-700 dark:text-slate-300">Generating Next Class</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
										Our AI is working on creating your next class. This typically takes about 2 minutes.
									</p>
									<div className="mt-4 w-64 mx-auto">
										<Progress value={calculateProgress()} className="h-1.5" />
										<p className="text-xs text-slate-400 mt-1 text-right">
											{calculateProgress()}% completed
										</p>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center py-16 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/30">
							<div className="text-center">
								<div className="relative inline-flex mb-4">
									<div className="absolute inset-0 rounded-full animate-ping bg-blue-200 dark:bg-blue-500/20 opacity-75"></div>
									<Spinner className="relative z-10" size="lg" />
								</div>
								<h3 className="text-lg font-medium mb-2 text-slate-700 dark:text-slate-300">Generating Your Course</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
									Please wait while our AI generates your course content. The first class should be ready in about 2 minutes.
								</p>
								<div className="mt-4 w-64 mx-auto">
									<Progress value={5} className="h-1.5" />
									<p className="text-xs text-slate-400 mt-1 text-right">
										5% completed
									</p>
								</div>
							</div>
						</div>
					)}
					
					{/* Button to add manual content */}
					<div className="mt-8 text-center">
						<Button variant="outline">
							<Plus className="h-4 w-4 mr-2" />
							Add Manual Content
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseEditor;
