import api from "./api";

export interface ClassData {
	id: string;
	title: string;
	classNo: number;
	concepts: string[];
	moduleId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ModuleData {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	syllabusId: string;
	classes: ClassData[];
}

export interface CourseDetailsResponse {
	data: {
    groups: any;
    files: any;
    enrolledUsers: any;
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		userId: string;
		modules: ModuleData[];
	};
}

export interface SlideData {
	id: string;
	title: string;
	slideNo: number;
	visualPrompt: string;
	voiceoverScript: string;
	imageUrl: string | null;
	content: string;
	example: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface QuizQuestion {
	id: string;
	question: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface QuizQuestionWithOptions {
	id: number;
	question: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	classId: number;
	createdAt: string;
	updatedAt: string;
}

export interface QuizAnswer {
	id: string | number;
	optionMarked: string; // Now can be "a", "b", "c", "d" instead of "option1", "option2", etc.
}

export interface QuizSubmissionRequest {
	classId: string;
	answers: QuizAnswer[];
}

export interface QuizSubmissionResponse {
	data: {
		score: number;
	};
}

export interface UserTest {
    id: string;
    classId: string;
    userId: string;
    score: number;
    createdAt: string;
    updatedAt: string;
}

export interface FAQ {
	id: string;
	question: string;
	answer: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ClassDetailsResponse {
	data: {
		id: string;
		title: string;
		classNo: number;
		concepts: string[];
		moduleId: string;
		createdAt: string;
		updatedAt: string;
		slides: SlideData[];
		faqs: FAQ[];
		assessment: {
			quiz: QuizQuestion[];
		};
		userTest?: UserTest; // Added userTest as an optional property
	};
}

export interface CourseUser {
	id: string;
	name: string;
	role: "learner" | "instructor";
	email: string;
	enrollmentDate: string;
	completionDate: string | null;
	expirationDate: string | null;
	progress: number;
}

export interface CourseFile {
	id: string;
	name: string;
	type: string;
	size: number;
	url: string;
	uploadedBy: string;
	uploadedAt: string;
}

export interface CourseGroup {
	id: string;
	name: string;
	description: string;
	membersCount: number;
	createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  category: string;
  price?: number;
  currency?: string;
  categoryId: string;
  categoryName: string;
  courseCode: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CourseEnrolledResponse {
  id: string;
  progress: number;
  completionDate: string | null;
  enrolledAt: string;
  userName: string;
  userRole: string;
}

export interface CourseFiles {
  id: string;
  courseId: string;
  userId: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseGroups {
  id: string;
  courseId: string;
  groupName: string;
  description: string;
  groupCreatorId: string;
  groupMembers: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailResponse {
  data: {
    enrolledUsers: CourseEnrolledResponse[];
    files: CourseFiles[];
    groups: CourseGroups[];
  };
}

export const courseService = {
  async getCourseDetails(courseId: string): Promise<CourseDetailsResponse> {
    try {
      const response = await api.get<CourseDetailsResponse>(
        `/user/course-details/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  },

  async updateModuleTitle(moduleId: string, title: string): Promise<any> {
    try {
      // This is a placeholder for an actual API call that would update the module title
      // In a real application, you would implement this endpoint
      const response = await api.patch(`/user/module/${moduleId}`, { title });
      return response.data;
    } catch (error) {
      console.error("Error updating module title:", error);
      throw error;
    }
  },

  async getClassDetails(classId: string): Promise<ClassDetailsResponse> {
    try {
      const response = await api.get<ClassDetailsResponse>(
        `/user/class/${classId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching class details:", error);
      throw error;
    }
  },

  async getQuizQuestions(classId: string): Promise<QuizQuestionWithOptions[]> {
    try {
      const response = await api.get(`/user/quiz/${classId}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      // Return an empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },

  async submitQuizAnswers(payload: QuizSubmissionRequest): Promise<QuizSubmissionResponse> {
    try {
      const response = await api.post<QuizSubmissionResponse>(`/user/submit-quiz`, payload);
      return response.data;
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
      throw error;
    }
  },

  async getCourses(): Promise<Course[]> {
    try {
      const response = await api.get('/user/courses');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  async enrollUserToCourse(courseId: string, userId: string): Promise<void> {
    try {
      await api.post('/user/enroll-user-to-course', {
        courseId,
        userId
      });
    } catch (error) {
      console.error("Error enrolling user to course:", error);
      throw error;
    }
  },

  async getCourseDetail(courseId: string): Promise<CourseDetailResponse> {
    try {
      const response = await api.get<CourseDetailResponse>(`/user/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course detail:", error);
      throw error;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      await api.delete(`/course/${courseId}`);
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },

  async unenrollFromCourse(courseId: string, userId: string): Promise<void> {
    try {
      await api.post(`/user/unenroll-course`, {
        courseId,
        userId
      });
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      throw error;
    }
  }
};
