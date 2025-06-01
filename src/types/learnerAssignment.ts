
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
