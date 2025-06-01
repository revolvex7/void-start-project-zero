
import api from "./api";

export interface Question {
  id: string;
  question: string;
  type: 'brief' | 'fill-blank' | 'mcq';
  options?: string[] | null;
  correctAnswer?: string | null;
}

export interface LearnerAssignment {
  id: string;
  creatorId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  classNumbers: string[] | null;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  totalMarks: number;
  courseName: string;
  questions: Question[];
  isSubmitted?: boolean;
  submittedAt?: string;
  obtainedMarks?: number;
  status?: 'pending' | 'submitted' | 'graded' | 'overdue';
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

export const learnerAssignmentService = {
  // Get all assignments for learner
  getLearnerAssignments: async (): Promise<LearnerAssignmentResponse> => {
    try {
      const response = await api.get('/user/learner/assignments');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch learner assignments:', error);
      throw error;
    }
  },

  // Get assignment details with questions
  getAssignmentDetails: async (assignmentId: string): Promise<AssignmentDetailResponse> => {
    try {
      const response = await api.get(`/user/learner/assignment/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assignment details:', error);
      throw error;
    }
  },

  // Submit assignment answers
  submitAssignment: async (submission: AssignmentSubmission) => {
    try {
      const response = await api.post(`/user/learner/assignment/${submission.assignmentId}/submit`, {
        answers: submission.answers
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      throw error;
    }
  }
};
