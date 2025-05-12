import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { courseService, QuizQuestionWithOptions } from '@/services/courseService';

export interface QuizManagerProps {
  classId: string;
  quizzes: QuizQuestionWithOptions[];
  onQuizChange: (newQuizzes: QuizQuestionWithOptions[]) => void;
}

const QuizManager: React.FC<QuizManagerProps> = ({ classId, quizzes, onQuizChange }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestionWithOptions | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctOption: 'option1'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      correctOption: value
    }));
  };

  const resetForm = () => {
    setFormData({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctOption: 'option1'
    });
    setCurrentQuiz(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (quiz: QuizQuestionWithOptions) => {
    setCurrentQuiz(quiz);
    setFormData({
      question: quiz.question,
      option1: quiz.option1,
      option2: quiz.option2,
      option3: quiz.option3,
      option4: quiz.option4,
      correctOption: quiz.correctOption
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (quiz: QuizQuestionWithOptions) => {
    setCurrentQuiz(quiz);
    setIsDeleteDialogOpen(true);
  };

  const handleAddQuiz = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await courseService.addQuizQuestion(classId, formData);
      
      // Create a new quiz with the response data
      const newQuiz: QuizQuestionWithOptions = {
        id: response.data?.id || `temp-${Date.now()}`,
        question: formData.question,
        option1: formData.option1,
        option2: formData.option2,
        option3: formData.option3,
        option4: formData.option4,
        correctOption: formData.correctOption,
        classId: classId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update the quizzes array
      const updatedQuizzes = [...quizzes, newQuiz];
      onQuizChange(updatedQuizzes);
      
      toast.success("Quiz question added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding quiz question:", error);
      toast.error("Failed to add quiz question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditQuiz = async () => {
    if (!validateForm() || !currentQuiz) return;
    
    setIsSubmitting(true);
    try {
      await courseService.updateQuizQuestion(currentQuiz.id.toString(), formData);
      
      // Update the quiz in the quizzes array
      const updatedQuizzes = quizzes.map(quiz => 
        quiz.id === currentQuiz.id
          ? {
              ...quiz,
              question: formData.question,
              option1: formData.option1,
              option2: formData.option2,
              option3: formData.option3,
              option4: formData.option4,
              correctOption: formData.correctOption,
              updatedAt: new Date().toISOString()
            }
          : quiz
      );
      
      onQuizChange(updatedQuizzes);
      
      toast.success("Quiz question updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating quiz question:", error);
      toast.error("Failed to update quiz question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!currentQuiz) return;
    
    setIsSubmitting(true);
    try {
      await courseService.deleteQuizQuestion(currentQuiz.id.toString());
      
      // Remove the quiz from the quizzes array
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== currentQuiz.id);
      onQuizChange(updatedQuizzes);
      
      toast.success("Quiz question deleted successfully");
      setIsDeleteDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error deleting quiz question:", error);
      toast.error("Failed to delete quiz question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      toast.error("Question is required");
      return false;
    }
    if (!formData.option1.trim() || !formData.option2.trim() || !formData.option3.trim() || !formData.option4.trim()) {
      toast.error("All options are required");
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Quiz Questions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={openAddDialog}
          className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </div>
      
      {quizzes.length === 0 ? (
        <Card className="border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No quiz questions yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openAddDialog}
              className="bg-white dark:bg-slate-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz, index) => (
            <Card key={quiz.id} className="bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">Q{index + 1}.</span>
                    {quiz.question}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      onClick={() => openEditDialog(quiz)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                      onClick={() => openDeleteDialog(quiz)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className={`p-2 rounded-md ${quiz.correctOption === 'option1' ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50' : ''}`}>
                    <div className="flex items-center">
                      {quiz.correctOption === 'option1' && (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                      )}
                      <span className="font-medium mr-1">A:</span> {quiz.option1}
                    </div>
                  </div>
                  <div className={`p-2 rounded-md ${quiz.correctOption === 'option2' ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50' : ''}`}>
                    <div className="flex items-center">
                      {quiz.correctOption === 'option2' && (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                      )}
                      <span className="font-medium mr-1">B:</span> {quiz.option2}
                    </div>
                  </div>
                  <div className={`p-2 rounded-md ${quiz.correctOption === 'option3' ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50' : ''}`}>
                    <div className="flex items-center">
                      {quiz.correctOption === 'option3' && (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                      )}
                      <span className="font-medium mr-1">C:</span> {quiz.option3}
                    </div>
                  </div>
                  <div className={`p-2 rounded-md ${quiz.correctOption === 'option4' ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50' : ''}`}>
                    <div className="flex items-center">
                      {quiz.correctOption === 'option4' && (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                      )}
                      <span className="font-medium mr-1">D:</span> {quiz.option4}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Quiz Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Input 
                id="question" 
                name="question"
                value={formData.question} 
                onChange={handleInputChange} 
                placeholder="Enter your question"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="option1">Option A</Label>
              <Input 
                id="option1" 
                name="option1"
                value={formData.option1} 
                onChange={handleInputChange} 
                placeholder="First option"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="option2">Option B</Label>
              <Input 
                id="option2" 
                name="option2"
                value={formData.option2} 
                onChange={handleInputChange} 
                placeholder="Second option"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="option3">Option C</Label>
              <Input 
                id="option3" 
                name="option3"
                value={formData.option3} 
                onChange={handleInputChange} 
                placeholder="Third option"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="option4">Option D</Label>
              <Input 
                id="option4" 
                name="option4"
                value={formData.option4} 
                onChange={handleInputChange} 
                placeholder="Fourth option"
              />
            </div>
            <div className="grid gap-2">
              <Label>Correct Answer</Label>
              <RadioGroup 
                value={formData.correctOption} 
                onValueChange={handleRadioChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1-radio" />
                  <Label htmlFor="option1-radio">Option A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2-radio" />
                  <Label htmlFor="option2-radio">Option B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3-radio" />
                  <Label htmlFor="option3-radio">Option C</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option4" id="option4-radio" />
                  <Label htmlFor="option4-radio">Option D</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                'Add Question'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Quiz Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question">Question</Label>
              <Input 
                id="edit-question" 
                name="question"
                value={formData.question} 
                onChange={handleInputChange} 
                placeholder="Enter your question"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-option1">Option A</Label>
              <Input 
                id="edit-option1" 
                name="option1"
                value={formData.option1} 
                onChange={handleInputChange} 
                placeholder="First option"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-option2">Option B</Label>
              <Input 
                id="edit-option2" 
                name="option2"
                value={formData.option2} 
                onChange={handleInputChange} 
                placeholder="Second option"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-option3">Option C</Label>
              <Input 
                id="edit-option3" 
                name="option3"
                value={formData.option3} 
                onChange={handleInputChange} 
                placeholder="Third option"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-option4">Option D</Label>
              <Input 
                id="edit-option4" 
                name="option4"
                value={formData.option4} 
                onChange={handleInputChange} 
                placeholder="Fourth option"
              />
            </div>
            <div className="grid gap-2">
              <Label>Correct Answer</Label>
              <RadioGroup 
                value={formData.correctOption} 
                onValueChange={handleRadioChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="edit-option1-radio" />
                  <Label htmlFor="edit-option1-radio">Option A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="edit-option2-radio" />
                  <Label htmlFor="edit-option2-radio">Option B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="edit-option3-radio" />
                  <Label htmlFor="edit-option3-radio">Option C</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option4" id="edit-option4-radio" />
                  <Label htmlFor="edit-option4-radio">Option D</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update Question'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Quiz Question</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this quiz question? This action cannot be undone.
            </p>
            {currentQuiz && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                <p className="font-medium text-slate-900 dark:text-slate-100">{currentQuiz.question}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Question'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManager;
