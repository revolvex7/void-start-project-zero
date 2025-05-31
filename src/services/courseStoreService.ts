
import api from './api';

export const courseStoreService = {
  fetchCourseStore: async () => {
    const response = await api.get('/course-store');
    return response.data;
  }
};
