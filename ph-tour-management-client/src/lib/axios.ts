import { ENV } from "@/config/env_config";
import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
  withCredentials: true,
});

// request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// response interceptor

interface iPendingQueueProps {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}

let isRefreshing = false;

let pendingQueue: iPendingQueueProps[] = [];

const handlePendingQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(null);
  });

  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { statusCode, message } = error.response.data;

    const originalRequest = error.config as AxiosRequestConfig & { _retry: boolean };

    if (statusCode === 401 && message === "Invalid token" && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((error) => Promise.reject(error));
      }

      try {
        isRefreshing = true;
        await axiosInstance.post("/auth/refresh-token");
        handlePendingQueue(null);
        return axiosInstance(originalRequest);
      } catch (error) {
        handlePendingQueue(error);
      } finally {
        isRefreshing = false;
      }
    }

    // For every request
    return Promise.reject(error);
  }
);

/*

// Production-ready axios response interceptor
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface PendingRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: any) => void;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

class TokenManager {
  private isRefreshing = false;
  private pendingQueue: PendingRequest[] = [];
  private maxRetryAttempts = 1;
  private refreshPromise: Promise<void> | null = null;

  constructor(
    private axiosInstance: any,
    private onTokenRefreshSuccess?: (tokens: RefreshTokenResponse) => void,
    private onTokenRefreshFailure?: () => void,
    private getRefreshToken?: () => string | null
  ) {}

  private processPendingQueue(error?: any): void {
    this.pendingQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else {
        // Re-execute the original request with new token
        request.resolve(this.axiosInstance.request(request));
      }
    });
    
    this.pendingQueue = [];
  }

  private async refreshTokens(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken?.();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.axiosInstance.post<RefreshTokenResponse>(
        '/auth/refresh-token',
        { refreshToken },
        {
          // Skip interceptor for refresh request to avoid infinite loop
          _skipAuthRefresh: true,
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Update tokens in storage/context
      this.onTokenRefreshSuccess?.({ 
        accessToken, 
        refreshToken: newRefreshToken 
      });

      // Update default authorization header
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    } catch (error) {
      // Handle refresh failure - redirect to login
      this.onTokenRefreshFailure?.();
      throw error;
    }
  }

  public async handleTokenRefresh(originalRequest: AxiosRequestConfig & { _retry?: number }): Promise<AxiosResponse> {
    // Check if already retried maximum times
    const retryCount = originalRequest._retry || 0;
    if (retryCount >= this.maxRetryAttempts) {
      throw new Error('Maximum token refresh attempts exceeded');
    }

    // If already refreshing, queue the request
    if (this.isRefreshing && this.refreshPromise) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        this.pendingQueue.push({ resolve, reject });
      });
    }

    // Start refresh process
    if (!this.refreshPromise) {
      this.isRefreshing = true;
      this.refreshPromise = this.refreshTokens();
    }

    try {
      await this.refreshPromise;
      
      // Mark request as retried
      originalRequest._retry = retryCount + 1;
      
      // Process pending queue
      this.processPendingQueue();
      
      // Retry original request
      return this.axiosInstance.request(originalRequest);
      
    } catch (error) {
      this.processPendingQueue(error);
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }
}

// Initialize token manager
const tokenManager = new TokenManager(
  axiosInstance,
  // onTokenRefreshSuccess callback
  (tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  },
  // onTokenRefreshFailure callback
  () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Redirect to login page
    window.location.href = '/login';
  },
  // getRefreshToken callback
  () => localStorage.getItem('refreshToken')
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { 
      _retry?: number;
      _skipAuthRefresh?: boolean;
    };

    // Don't retry if it's a refresh token request
    if (originalRequest._skipAuthRefresh) {
      return Promise.reject(error);
    }

    // Check for authentication errors
    const isAuthError = error.response?.status === 401;
    const errorMessage = error.response?.data?.message;
    const isTokenInvalid = errorMessage === 'Invalid token' || 
                          errorMessage === 'Token expired' ||
                          errorMessage === 'Unauthorized';

    if (isAuthError && isTokenInvalid) {
      try {
        return await tokenManager.handleTokenRefresh(originalRequest);
      } catch (refreshError) {
        // Log refresh error for monitoring
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Handle other types of errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error);
      // Could implement retry logic for server errors
    }

    return Promise.reject(error);
  }
);

// Request interceptor to add auth header
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && !config.headers?.Authorization) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

*/
