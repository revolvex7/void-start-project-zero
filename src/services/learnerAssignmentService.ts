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

const mockAssignments: LearnerAssignment[] = [
  {
    id: '1',
    creatorId: 'creator1',
    courseId: 'course1',
    title: 'Introduction to React Hooks',
    description: 'Complete the exercises to demonstrate your understanding of React Hooks, including useState, useEffect, and custom hooks.',
    courseName: 'Advanced React Development',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    classNumbers: null,
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    totalMarks: 100,
    isSubmitted: false,
    questions: [
      {
        id: 'q1',
        question: 'Explain the difference between useState and useRef.',
        type: 'brief',
        options: null,
        correctAnswer: null
      },
      {
        id: 'q2',
        question: 'Which hook is used for side effects in React?',
        type: 'mcq',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'useEffect'
      }
    ]
  },
  {
    id: '2',
    creatorId: 'creator1',
    courseId: 'course2',
    title: 'CSS Grid Layout Project',
    description: 'Create a responsive layout using CSS Grid. Your submission should include both the code and a brief explanation of your approach.',
    courseName: 'Modern CSS Techniques',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    classNumbers: null,
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    totalMarks: 50,
    isSubmitted: true,
    obtainedMarks: 45,
    questions: [
      {
        id: 'q1',
        question: 'What is the main advantage of CSS Grid over Flexbox?',
        type: 'brief',
        options: null,
        correctAnswer: null
      },
      {
        id: 'q2',
        question: 'Complete the grid template areas property:',
        type: 'fill-blank',
        options: null,
        correctAnswer: 'grid-template-areas: "header header" "sidebar main" "footer footer";'
      }
    ]
  }
];

class LearnerAssignmentService {
  async getLearnerAssignments(): Promise<{ data: LearnerAssignment[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: mockAssignments };
  }

  async getAssignmentById(id: string): Promise<LearnerAssignment | null> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const assignment = mockAssignments.find(a => a.id === id);
    return assignment || null;
  }

  async submitAssignment(id: string, answers: Record<string, any>): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real implementation, this would send the answers to the server
    console.log('Submitting assignment:', id, answers);
  }
}

export const learnerAssignmentService = new LearnerAssignmentService();
