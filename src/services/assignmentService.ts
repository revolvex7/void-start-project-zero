import api from "./api";

export interface AssignmentQuestion {
  id: string;
  question: string;
  type: string;
  options: string[] | null;
  correctAnswer: string | null;
}

export interface SubmittedAnswer {
  id: string;
  studentAssignmentsId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean | null;
  createdAt: string;
  updatedAt: string;
  question: string;
  type: string;
  options: string[] | null;
  correctAnswer: string | null;
}

export interface SubmittedAssignmentResponse {
  data: SubmittedAnswer[];
}

export interface AssignmentSubmissionResponse {
  id: string;
  userId: string;
  assignmentId: string;
  fileUrl?: string | null;
  submittedAt?: string;
  feedback?: string | null;
  obtainMarks?: number | null;
  isSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'graded' | 'late' | 'submitted' | 'not submitted';
  courseName: string;
  studentName: string;
  studentEmail: string;
  studentProfileImage?: string | null;
}

export interface AssignmentDetail {
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
  questions: AssignmentQuestion[];
  submissions: AssignmentSubmissionResponse[];
}

export interface AssignmentDetailResponse {
  data: AssignmentDetail;
}

export const assignmentService = {
  // Get all assignments for instructor
  getInstructorAssignments: async () => {
    try {
      const response = await api.get('/user/assignments');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch instructor assignments:', error);
      throw error;
    }
  },

  // Get assignment submissions by assignment ID
  getAssignmentSubmissions: async (assignmentId: string) => {
    try {
      const response = await api.get(`/user/assignment/submissions/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assignment submissions:', error);
      throw error;
    }
  },

  // Get submitted assignment answers by student assignment ID
  getSubmittedAssignment: async (studentAssignmentId: string): Promise<SubmittedAssignmentResponse> => {
    try {
      const response = await api.get(`/user/submtted-assignment/${studentAssignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch submitted assignment:', error);
      throw error;
    }
  },

  // Get assignments for a specific course
  getAssignments: async (courseId: string) => {
    try {
      const response = await api.get(`/user/assignments/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      throw error;
    }
  },

  // Create new assignment
  createAssignment: async (courseId: string, assignmentData: any) => {
    try {
      const response = await api.post(`/user/assignments/${courseId}`, assignmentData);
      return response.data;
    } catch (error) {
      console.error('Failed to create assignment:', error);
      throw error;
    }
  },

  // Update assignment
  updateAssignment: async (assignmentId: string, assignmentData: any) => {
    try {
      const response = await api.put(`/user/assignments/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      console.error('Failed to update assignment:', error);
      throw error;
    }
  },

  // Delete assignment
  deleteAssignment: async (assignmentId: string) => {
    try {
      const response = await api.delete(`/user/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      throw error;
    }
  }
};
