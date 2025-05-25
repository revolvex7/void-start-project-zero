
export interface Assignment {
  id: string;
  creatorId: string;
  courseId: string;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string; // ISO date string (can be parsed to Date)
  classNumbers: string[] | null;
  isAiGenerated: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  published: boolean;
  totalMarks: number;
  courseName: string;
  totalSubmissions: string; // note: this is a string even though it's a count
  status: string;
}

export interface AssignmentResponse {
  data: Assignment[];
}
