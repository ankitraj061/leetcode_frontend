'use client'
import { axiosClient } from '@/app/utils/axiosClient';
import { 
  ProblemsResponse, 
  TopicsResponse, 
  CompaniesResponse, 
  SaveProblemResponse, 
  ProblemsFilters,
  APIError 
} from './types';

export class ProblemsAPI {
  static async getAllProblems(filters: ProblemsFilters): Promise<ProblemsResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await axiosClient.get(`/api/user/problem/all?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async getAllTopics(): Promise<TopicsResponse> {
    try {
      const response = await axiosClient.get('/api/user/problem/topics');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async getAllCompanies(): Promise<CompaniesResponse> {
    try {
      const response = await axiosClient.get('/api/user/problem/companies');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async toggleSaveProblem(problemId: string): Promise<SaveProblemResponse> {
    try {
      const response = await axiosClient.post(`/api/user/problem/save/${problemId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static handleError(error: any): APIError {
    if (error.response?.data?.error) {
      return {
        error: error.response.data.error,
        message: error.response.data.message || error.response.data.error
      };
    }
    
    if (error.message) {
      return {
        error: 'Network Error',
        message: error.message
      };
    }

    return {
      error: 'Unknown Error',
      message: 'An unexpected error occurred'
    };
  }
}

export const problemsAPI = ProblemsAPI;
