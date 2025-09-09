import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, tokenManager, User, LoginResponse, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, full_name: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokenManager.getAccessToken();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.auth.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to get current user:', error);
      
      // Try to refresh token
      const refreshed = await refreshToken();
      if (!refreshed) {
        // Clear invalid tokens
        tokenManager.clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await api.auth.login(email, password);
      
      // Store tokens
      tokenManager.setTokens(response.access_token, response.refresh_token);
      
      // Set user data
      setUser(response.user);
      
      toast.success(`خوش آمدید ${response.user.full_name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            toast.error('ایمیل یا رمز عبور نادرست است');
            break;
          case 422:
            toast.error('لطفاً اطلاعات را به درستی وارد کنید');
            break;
          case 0:
            toast.error('خطا در اتصال به سرور');
            break;
          default:
            toast.error(error.message || 'خطا در ورود به سیستم');
        }
      } else {
        toast.error('خطای غیرمنتظره رخ داد');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, full_name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await api.auth.register(email, password, full_name);
      
      // Store tokens
      tokenManager.setTokens(response.access_token, response.refresh_token);
      
      // Set user data
      setUser(response.user);
      
      toast.success(`ثبت‌نام با موفقیت انجام شد. خوش آمدید ${response.user.full_name}!`);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('این ایمیل قبلاً ثبت شده است');
            break;
          case 422:
            toast.error('لطفاً اطلاعات را به درستی وارد کنید');
            break;
          case 0:
            toast.error('خطا در اتصال به سرور');
            break;
          default:
            toast.error(error.message || 'خطا در ثبت‌نام');
        }
      } else {
        toast.error('خطای غیرمنتظره رخ داد');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
    toast.info('با موفقیت از سیستم خارج شدید');
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const success = await tokenManager.refreshAccessToken();
      if (success) {
        // Get updated user data
        const userData = await api.auth.getCurrentUser();
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // Auto refresh token when it's about to expire
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const token = tokenManager.getAccessToken();
      if (!token) return;

      try {
        // Check if token is about to expire (within 5 minutes)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiresIn = payload.exp * 1000 - Date.now();
        
        if (expiresIn < 5 * 60 * 1000) { // 5 minutes
          await refreshToken();
        }
      } catch (error) {
        console.error('Token parsing error:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hrbooteh-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-hrbooteh-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-hrbooteh-text-secondary">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-hrbooteh-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-hrbooteh-text-primary mb-4">
            دسترسی محدود
          </h1>
          <p className="text-hrbooteh-text-secondary mb-6">
            برای دسترسی به این صفحه وارد شوید
          </p>
          <div className="space-x-4">
            <a 
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-hrbooteh-primary text-white rounded-lg hover:bg-hrbooteh-primary-hover transition-colors"
            >
              ورود
            </a>
            <a 
              href="/register"
              className="inline-flex items-center px-4 py-2 border border-hrbooteh-surface-elevated text-hrbooteh-text-primary rounded-lg hover:bg-hrbooteh-surface-elevated transition-colors"
            >
              ثبت‌نام
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
