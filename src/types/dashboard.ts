export enum UserRoles {
  User = 'User',
  SuperAdmin = 'SuperAdmin',
  Parent = 'Parent',
  Administrator = 'Administrator',
  Instructor = 'Instructor',
  Learner = 'Learner',
}

export interface AdminDashboardData {
  totalCourses: number;
  activeUsers: number;
  courseCompletion: number;
  activityRate: number;
  totalUsers: number;
  adminUsers: number;
  instructorUsers: number;
  learners: number;
  parents?: number;
}

export interface InstructorDashboardData {
  myCourses: number;
  activeStudents: number;
  assignments: number;
  avgGrade: number;
  assignmentsList: Array<{
    assignmentName: string;
    totalSubmissions: string;
  }>;
}

export interface LearnerDashboardData {
  completedCourses: number;
  activeCourses: number;
  certificates: number;
  avgGrade: number;
  assignmentDeadlines: Array<{
    assignmentName: string;
    submissionDate: string;
    isSubmitted: boolean;
  }>;
  coursesInProgress: Array<{
    courseName: string;
    instructorName: string;
    completedPercentage: number;
    totalHoursLeft: number;
  }>;
  recommendedCourses: Array<{
    courseName: string;
    ratings: number;
    reviews: number;
  }>;
}

export interface ParentChildData {
  id: string;
  name: string;
  profileImage: string;
  enrolledCourses: string;
  lastLogin: string;
  overAllProgress: string;
}

export type ParentDashboardData = ParentChildData[];

export type DashboardResponse = AdminDashboardData | InstructorDashboardData | LearnerDashboardData | ParentDashboardData | null;

export interface ApiResponse<T> {
  data: T;
}

// Child Details API Types
export interface ChildUserData {
  name: string;
  profileImage: string | null;
  lastLogin: string;
  enrolledCourses: number;
  overAllProgress: string | null;
}

export interface ChildEnrolledCourse {
  id: string;
  progress: string;
  completionDate: string | null;
  enrolledAt: string;
  userName: string;
  userRole: string;
  userId: string;
  courseId: string;
  classNo: string;
  courseName: string;
  courseDescription: string;
  courseImage: string;
  categoryName: string;
  instructorName: string;
  totalClasses: string;
  avgAssignmentGrades: number | null;
}

export interface ChildDetailsResponse {
  data: {
    user: ChildUserData;
    enrolledCourses: ChildEnrolledCourse[];
  };
}
