import api from "./api";

export interface AssignmentReportsData {
  totalAssignments: number;
  totalSubmitted: number;
  totalPending: number;
  totalGraded: number;
  totalNotGraded: number;
  totalNotSubmitted: number;
}

export interface AssignmentItem {
  id: string;
  title: string;
  dueDate: string;
  published: boolean;
  courseTitle: string;
  status: string;
  obtainMarks: number | null;
  isSubmitted: boolean;
  assignmentId: string;
  totalSubmitted: string;
}

export interface AssignmentReportsResponse {
  stats: AssignmentReportsData;
  assignment: AssignmentItem[];
}

export interface UserReportsDataInstructor {
  totalStudents: number;
  totalActiveStudents: number;
  totalCourses: number;
  totalAssignments: number;
  totalEnrolled: number;
  averageCompletionRate: string;
}

export interface UserReportsDataAdmin {
  totalUsers: number;
  totalActiveUsers: number;
  totalInstructorUsers: number;
  totalLearnerUsers: number;
}

export interface CourseReportsData {
  totalCourses: number;
  publishedCourses: number;
  totalAssignments: number;
  totalStudentsEnrolled: number;
  averageCompletionRate: number;
  totalClasses: number;
  totalTime: number;
}

export type ReportType = 'course' | 'user' | 'assignment';
export type ViewAs = 'admin' | 'instructor';

export interface ReportsResponse<T> {
  data: T;
}

class ReportsService {
  async getReports<T>(type: ReportType, viewAs: ViewAs): Promise<T> {
    try {
      const response = await api.get(`/user/reports?type=${type}&viewAs=${viewAs}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${type} reports for ${viewAs}:`, error);
      throw error;
    }
  }

  async getAssignmentReports(viewAs: ViewAs): Promise<AssignmentReportsResponse> {
    return this.getReports<AssignmentReportsResponse>('assignment', viewAs);
  }

  async getUserReportsInstructor(): Promise<UserReportsDataInstructor> {
    return this.getReports<UserReportsDataInstructor>('user', 'instructor');
  }

  async getUserReportsAdmin(): Promise<UserReportsDataAdmin> {
    return this.getReports<UserReportsDataAdmin>('user', 'admin');
  }

  async getCourseReports(viewAs: ViewAs): Promise<CourseReportsData> {
    return this.getReports<CourseReportsData>('course', viewAs);
  }
}

export const reportsService = new ReportsService(); 