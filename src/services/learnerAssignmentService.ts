import api from "./api";

export interface Question {
  id: string;
  question: string;
  type: 'brief' | 'fill-blank' | 'multiple-choice';
  options: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface LearnerAssignment {
  id: string;
  status: string;
  userId: string;
  submittedAt: string | null;
  feedback: string | null;
  obtainMarks: number | null;
  isSubmitted: boolean;
  assignmentId: string;
  title: string;
  description: string;
  totalMarks: number;
  courseName: string;
  courseImage: string;
  dueDate: string;
  totalquestions: string;
  // Additional properties for compatibility
  questions?: Question[];
  obtainedMarks?: number; // alias for obtainMarks
}

export interface AssignmentSubmission {
  assignmentId: string;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}

export interface LearnerAssignmentResponse {
  data: LearnerAssignment[];
}

export interface AssignmentDetailResponse {
  data: LearnerAssignment;
}

export interface AssignmentQuestionsResponse {
  data: Question[];
}

class LearnerAssignmentService {
  async getLearnerAssignments(): Promise<{ data: LearnerAssignment[] }> {
    try {
      const response = await api.get('/student/assignments');
      
      // Transform the data to match component expectations
      const transformedData = response.data.map((assignment: any) => ({
        ...assignment,
        // Add obtainedMarks as alias for obtainMarks for backward compatibility
        obtainedMarks: assignment.obtainMarks,
        // Parse totalquestions to number for questions count
        questions: new Array(parseInt(assignment.totalquestions || '0')).fill(null).map((_, index) => ({
          id: `q${index + 1}`,
          question: `Question ${index + 1}`,
          type: 'brief' as const,
          options: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching learner assignments:', error);
      throw error;
    }
  }

  async getAssignmentById(id: string): Promise<LearnerAssignment | null> {
    try {
      const response = await api.get(`/student/assignments/${id}`);
      
      if (response.data) {
        // Transform single assignment data
        const assignment = {
          ...response.data,
          obtainedMarks: response.data.obtainMarks,
          questions: [] // Questions will be fetched separately
        };
        
        return assignment;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching assignment by ID:', error);
      return null;
    }
  }

  async getAssignmentQuestions(assignmentId: string): Promise<Question[]> {
    try {
      const response = await api.get(`/student/assignment-questions/${assignmentId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching assignment questions:', error);
      throw error;
    }
  }

  async submitAssignment(studentAssignmentId: string, answers: Record<string, any>): Promise<void> {
    try {
      // Transform answers to the required format
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer: String(answer) // Ensure answer is a string
      }));

      await api.post(`/student/assignment-submission/${studentAssignmentId}`, {
        answers: formattedAnswers
      });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  }

  async getStudentAssignmentDetails(studentAssignmentId: string): Promise<{ assignmentId: string } | null> {
    try {
      // Get the assignment ID from student assignment ID by finding it in the assignments list
      const assignmentsResponse = await this.getLearnerAssignments();
      const studentAssignment = assignmentsResponse.data.find(a => a.id === studentAssignmentId);
      
      if (studentAssignment) {
        return { assignmentId: studentAssignment.assignmentId };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching student assignment details:', error);
      throw error;
    }
  }
}

export const learnerAssignmentService = new LearnerAssignmentService();
