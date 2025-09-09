/**
 * API Client for hrbooteh backend
 * Handles all HTTP requests to Python FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  expires_in: number;
}

export interface Assessment {
  id: number;
  assessment_type: string;
  user_id: number;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
  analysis?: any;
}

export interface AssessmentMessage {
  id: number;
  assessment_id: number;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
}

export interface AIResponse {
  message: string;
  should_continue: boolean;
  analysis_ready?: boolean;
}

// Custom error class
export class ApiError extends Error {
  public status: number;
  public response: any;

  constructor(status: number, message: string, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Request interceptor for adding auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Generic request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    (defaultHeaders as any).Authorization = `Bearer ${token}`;
  }

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }

      throw new ApiError(
        response.status,
        errorData.detail || errorData.message || 'API request failed',
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Network error - Unable to connect to server');
    }

    // Handle other errors
    throw new ApiError(0, error instanceof Error ? error.message : 'Unknown error');
  }
}

// API endpoints
export const api = {
  // Authentication
  auth: {
    async login(email: string, password: string): Promise<LoginResponse> {
      return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    async register(email: string, password: string, full_name: string): Promise<LoginResponse> {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name }),
      });
    },

    async refreshToken(refresh_token: string): Promise<{ access_token: string }> {
      return apiRequest('/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refresh_token}`,
        },
      });
    },

    async getCurrentUser(): Promise<User> {
      return apiRequest('/auth/me');
    },
  },

  // Assessments
  assessments: {
    async start(assessment_type: string, user_context?: string): Promise<{
      assessment_id: number;
      ai_response: AIResponse;
    }> {
      return apiRequest('/assessments/start', {
        method: 'POST',
        body: JSON.stringify({ 
          assessment_type,
          user_context: user_context || `شروع ارزیابی ${assessment_type}`
        }),
      });
    },

    async sendMessage(assessment_id: number, message: string): Promise<{
      ai_response: AIResponse;
      analysis_ready?: boolean;
    }> {
      return apiRequest(`/assessments/${assessment_id}/message`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },

    async getResults(assessment_id: number): Promise<{
      assessment: Assessment;
      messages: AssessmentMessage[];
      analysis: any;
    }> {
      return apiRequest(`/assessments/${assessment_id}/results`);
    },

    async getUserAssessments(): Promise<Assessment[]> {
      return apiRequest('/assessments/user');
    },

    async getAssessmentDetails(assessment_id: number): Promise<{
      assessment: Assessment;
      messages: AssessmentMessage[];
    }> {
      return apiRequest(`/assessments/${assessment_id}`);
    },
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    const url = API_BASE_URL.replace('/api/v1', '/health');
    return fetch(url).then(res => res.json());
  },
};

// Token management utilities
export const tokenManager = {
  setTokens(access_token: string, refresh_token: string): void {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await api.auth.refreshToken(refreshToken);
      this.setTokens(response.access_token, refreshToken);
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  },
};

// Assessment type mapping
export const ASSESSMENT_TYPES = {
  independence: 'استقلال',
  confidence: 'اعتماد به نفس', 
  negotiation: 'مهارت‌های مذاکره',
  leadership: 'مهارت‌های رهبری',
  communication: 'مهارت‌های ارتباطی',
} as const;

export const ASSESSMENT_TYPE_KEYS = Object.keys(ASSESSMENT_TYPES) as Array<keyof typeof ASSESSMENT_TYPES>;

export default api;
