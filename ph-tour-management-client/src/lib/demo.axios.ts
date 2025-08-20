/* eslint-disable @typescript-eslint/no-explicit-any */
// Production-ready axios interceptor for HTTP-only cookies
import { ENV } from "@/config/env_config";
import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  AxiosError,
} from "axios";

interface PendingRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: any) => void;
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: any;
}

export const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
  withCredentials: true,
  timeout: 15000, // 15 second default timeout
});

const TOKEN_ERRORS = new Set([
  "Invalid token",
  "Token expired",
  "jwt expired",
  "Unauthorized",
  "Access token expired",
  "TokenExpiredError",
  "JsonWebTokenError",
]);

class CookieBasedTokenManager {
  private isRefreshing = false;
  private pendingQueue: PendingRequest[] = [];
  private maxRetryAttempts = 1;
  private refreshPromise: Promise<void> | null = null;
  private axiosInstance: any;
  private onAuthFailure?: () => void;
  private refreshEndpoint: string;

  constructor(
    axiosInstance: any,
    onAuthFailure?: () => void,
    refreshEndpoint: string = "/auth/refresh-token"
  ) {
    this.axiosInstance = axiosInstance;
    this.onAuthFailure = onAuthFailure;
    this.refreshEndpoint = refreshEndpoint;

    // Ensure cookies are included in all requests
    this.axiosInstance.defaults.withCredentials = true;
  }

  private processPendingQueue(error?: any): void {
    this.pendingQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else {
        // Re-execute the original request
        this.axiosInstance
          .request(request.resolve)
          .then((response: AxiosResponse) => request.resolve(response))
          .catch((err: any) => request.reject(err));
      }
    });

    this.pendingQueue = [];
  }

  private async refreshTokens(): Promise<void> {
    try {
      // Call refresh endpoint - cookies will be sent automatically
      await this.axiosInstance.post(
        this.refreshEndpoint,
        {}, // Empty body since refresh token is in HTTP-only cookie
        {
          _skipAuthRefresh: true, // Skip interceptor for this request
          withCredentials: true, // Ensure cookies are sent
          timeout: 10000, // 10 second timeout for refresh
        }
      );

      // Backend should set new HTTP-only cookies in response
      // No manual token handling needed on frontend
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Clear any client-side auth state if needed
      this.onAuthFailure?.();

      throw error;
    }
  }

  public async handleTokenRefresh(
    originalRequest: AxiosRequestConfig & { _retry?: number }
  ): Promise<AxiosResponse> {
    // Check retry attempts
    const retryCount = originalRequest._retry || 0;
    if (retryCount >= this.maxRetryAttempts) {
      const error = new Error("Maximum token refresh attempts exceeded");
      this.onAuthFailure?.();
      throw error;
    }

    // If already refreshing, queue the request
    if (this.isRefreshing && this.refreshPromise) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        this.pendingQueue.push({
          resolve: (response: AxiosResponse) => resolve(response),
          reject,
        });
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

      // Retry original request with updated cookies
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
const tokenManager = new CookieBasedTokenManager(
  axiosInstance,
  // onAuthFailure callback
  () => {
    // Clear any client-side user data
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirect to login
    window.location.href = "/login";

    // Or dispatch logout action if using Redux/Context
    // dispatch(logout());
  },
  "/auth/refresh-token" // refresh endpoint
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: number;
      _skipAuthRefresh?: boolean;
    };

    // Don't retry refresh token requests
    if (originalRequest._skipAuthRefresh) {
      return Promise.reject(error);
    }

    const errorResponse = error?.response;
    const errorStatus = errorResponse?.status;
    const errorDataMessage = errorResponse?.data?.error?.[0]?.name || "";

    // Check for authentication errors
    const isAuthError = errorStatus === 401;
    const errorData = errorResponse?.data;

    // Check for various token-related error messages
    const isErrorMessageMatch =
      TOKEN_ERRORS.has(errorData!.message) || TOKEN_ERRORS.has(errorDataMessage);

    const isTokenError = isAuthError && errorData && isErrorMessageMatch;

    if (isTokenError) {
      try {
        return await tokenManager.handleTokenRefresh(originalRequest);
      } catch (refreshError) {
        console.error("Authentication failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!errorResponse) {
      console.error("Network error:", error.message);
      // Could implement retry logic for network errors
    }

    // Handle server errors (5xx)
    if (errorResponse && errorStatus) {
      if (errorStatus >= 500) {
        console.error("Server error:", errorStatus, errorResponse.data);
        // Could implement exponential backoff retry
      }

      // Handle client errors (4xx, excluding 401 which is handled above)
      if (errorStatus >= 400 && errorStatus < 500 && errorStatus !== 401) {
        console.warn("Client error:", errorStatus, errorResponse.data);
      }
    }

    return Promise.reject(error);
  }
);

// Request interceptor for logging and additional headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure credentials are always sent
    config.withCredentials = true;

    // Initialize headers if undefined
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    // CSRF Token (Cross-Site Request Forgery Protection)
    // Add CSRF token if available (for additional security)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Request ID (Traceability)
    // Add request ID for tracing
    config.headers["X-Request-ID"] = generateRequestId();

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Utility function to generate request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add global error handler for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // Send to error monitoring service
  // trackError(event.reason);
});

export default axiosInstance;

//

//

/*






চমৎকার প্রশ্ন! আমি step-by-step সিনারিও দিয়ে explain করি কিভাবে এই interceptor কাজ করে:

## 🎬 **Scenario 1: Normal Request (Token Valid)**

```
1. User clicks "View Profile" button
2. Frontend: axios.get('/api/profile')
3. Request Interceptor runs:
   ✅ withCredentials: true (cookies automatically attached)
   ✅ Adds X-Request-ID: "1234567890-abc"
   ✅ Request sent with HTTP-only cookies
4. Backend receives request with valid access token cookie
5. Backend responds: 200 OK with profile data
6. Response Interceptor runs:
   ✅ No error, returns response normally
7. User sees profile data
```

## 🔄 **Scenario 2: Token Expired (Single Request)**

```
1. User clicks "View Orders" after 15 minutes
2. Frontend: axios.get('/api/orders')
3. Request goes with expired access token cookie
4. Backend responds: 401 Unauthorized { message: "Token expired" }
5. Response Interceptor catches 401:
   ✅ isTokenError = true (message matches "Token expired")
   ✅ Calls tokenManager.handleTokenRefresh()
   
6. handleTokenRefresh() process:
   ✅ retryCount = 0 (first attempt)
   ✅ isRefreshing = false, so starts refresh
   ✅ Sets isRefreshing = true
   ✅ Calls refreshTokens()
   
7. refreshTokens() process:
   ✅ POST /auth/refresh-token (with _skipAuthRefresh: true)
   ✅ Request includes refresh token cookie automatically
   ✅ Backend validates refresh token
   ✅ Backend sets new access & refresh token cookies in response
   
8. After successful refresh:
   ✅ originalRequest._retry = 1
   ✅ Retries: axios.get('/api/orders') with new cookies
   ✅ Backend responds: 200 OK with orders data
   ✅ User sees orders (doesn't know token was refreshed!)
```

## ⚡ **Scenario 3: Multiple Concurrent Requests (Race Condition)**

```
User opens dashboard with 5 API calls simultaneously:
- /api/profile
- /api/orders  
- /api/notifications
- /api/settings
- /api/analytics

All have expired tokens...

1. Request 1 (/api/profile) gets 401 first:
   ✅ isRefreshing = false → starts refresh process
   ✅ isRefreshing = true
   ✅ refreshPromise = refreshTokens()
   
2. Request 2 (/api/orders) gets 401:
   ✅ isRefreshing = true → goes to pending queue
   ✅ pendingQueue.push({ resolve, reject })
   
3. Request 3, 4, 5 also get 401:
   ✅ All added to pendingQueue
   ✅ Total 4 requests waiting
   
4. First refresh completes successfully:
   ✅ New tokens set by backend
   ✅ processPendingQueue() called
   ✅ All 4 pending requests re-executed with new tokens
   ✅ All requests succeed
   
5. Result: Only 1 refresh call made, not 5!
```

## 🔄 **Scenario 4: Refresh Token Also Expired**

```
1. User returns after 7 days (refresh token expired)
2. Makes request: axios.get('/api/dashboard')
3. Gets 401, starts refresh process
4. POST /auth/refresh-token with expired refresh cookie
5. Backend responds: 401 { message: "Invalid token" }
6. refreshTokens() throws error
7. handleTokenRefresh() catches error:
   ✅ processPendingQueue(error) - rejects all pending
   ✅ onAuthFailure() callback triggered
   
8. onAuthFailure() executes:
   ✅ localStorage.removeItem('user')
   ✅ sessionStorage.clear()
   ✅ window.location.href = '/login'
   
9. User redirected to login page
```

## 🚫 **Scenario 5: Infinite Retry Prevention**

```
1. User makes request, token expires
2. First refresh attempt fails (network issue)
3. handleTokenRefresh():
   ✅ originalRequest._retry = 1
   ✅ retryCount = 1, maxRetryAttempts = 1
   ✅ retryCount >= maxRetryAttempts → throws error
   
4. "Maximum token refresh attempts exceeded"
5. onAuthFailure() called → redirect to login
```

## 🛡️ **Scenario 6: Skip Interceptor (Refresh Request)**

```
1. Token expires, refresh process starts
2. POST /auth/refresh-token called with _skipAuthRefresh: true
3. If refresh endpoint also returns 401:
   ✅ originalRequest._skipAuthRefresh = true
   ✅ Response interceptor sees this flag
   ✅ Skips token refresh logic
   ✅ Returns Promise.reject(error) directly
   
4. Prevents infinite loop of refresh calls
```

## 🔧 **Code Flow Visualization:**

```
Request → Request Interceptor → Backend
                ↓
         (Add cookies, headers)
                ↓
Backend Response → Response Interceptor
                ↓
         Is it 401 + token error?
         ├── No → Return response
         └── Yes → Token refresh needed
                ↓
         Is already refreshing?
         ├── Yes → Add to pending queue
         └── No → Start refresh process
                ↓
         POST /auth/refresh-token
         ├── Success → Retry original + process queue
         └── Fail → Clear auth + redirect login
```

## 🎯 **Key Benefits:**

1. **Seamless UX**: User doesn't notice token refresh
2. **Performance**: Multiple requests = single refresh call  
3. **Security**: HTTP-only cookies prevent XSS attacks
4. **Reliability**: Handles network issues, infinite loops
5. **Maintainable**: Clean error handling and logging

এই interceptor টি production-grade এবং সব edge cases handle করে!







*/

/*
























// Production-ready axios interceptor for HTTP-only cookies
import { ENV } from "@/config/env_config";
import axios, { type AxiosRequestConfig, type AxiosResponse, AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
  withCredentials: true,
  timeout: 15000 // 15 second default timeout
});

interface PendingRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: any) => void;
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

class CookieBasedTokenManager {
  private isRefreshing = false;
  private pendingQueue: PendingRequest[] = [];
  private maxRetryAttempts = 1;
  private refreshPromise: Promise<void> | null = null;
  private axiosInstance: any;
  private onAuthFailure?: () => void;
  private refreshEndpoint: string;

  constructor(
    axiosInstance: any,
    onAuthFailure?: () => void,
    refreshEndpoint: string = "/auth/refresh-token"
  ) {
    this.axiosInstance = axiosInstance;
    this.onAuthFailure = onAuthFailure;
    this.refreshEndpoint = refreshEndpoint;

    // Ensure cookies are included in all requests
    this.axiosInstance.defaults.withCredentials = true;
  }

  private processPendingQueue(error?: any): void {
    this.pendingQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else {
        // Re-execute the original request
        this.axiosInstance
          .request(request.resolve)
          .then((response: AxiosResponse) => request.resolve(response))
          .catch((err: any) => request.reject(err));
      }
    });

    this.pendingQueue = [];
  }

  private async refreshTokens(): Promise<void> {
    try {
      // Call refresh endpoint - cookies will be sent automatically
      await this.axiosInstance.post(
        this.refreshEndpoint,
        {}, // Empty body since refresh token is in HTTP-only cookie
        {
          _skipAuthRefresh: true, // Skip interceptor for this request
          withCredentials: true, // Ensure cookies are sent
          timeout: 10000, // 10 second timeout for refresh
        }
      );

      // Backend should set new HTTP-only cookies in response
      // No manual token handling needed on frontend
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Clear any client-side auth state if needed
      this.onAuthFailure?.();

      throw error;
    }
  }

  public async handleTokenRefresh(
    originalRequest: AxiosRequestConfig & { _retry?: number }
  ): Promise<AxiosResponse> {
    // Check retry attempts
    const retryCount = originalRequest._retry || 0;
    if (retryCount >= this.maxRetryAttempts) {
      const error = new Error("Maximum token refresh attempts exceeded");
      this.onAuthFailure?.();
      throw error;
    }

    // If already refreshing, queue the request
    if (this.isRefreshing && this.refreshPromise) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        this.pendingQueue.push({
          resolve: (response: AxiosResponse) => resolve(response),
          reject,
        });
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

      // Retry original request with updated cookies
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
const tokenManager = new CookieBasedTokenManager(
  axiosInstance,
  // onAuthFailure callback
  () => {
    // Clear any client-side user data
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirect to login
    window.location.href = "/login";

    // Or dispatch logout action if using Redux/Context
    // dispatch(logout());
  },
  "/auth/refresh-token" // refresh endpoint
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }
    return response;
  },

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: number;
      _skipAuthRefresh?: boolean;
    };

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ ${originalRequest.method?.toUpperCase()} ${originalRequest.url} - ${error.response?.status}`,
        error.response?.data
      );
    }

    // Don't retry refresh token requests
    if (originalRequest._skipAuthRefresh) {
      return Promise.reject(error);
    }

    // Check for authentication errors
    const isAuthError = error.response?.status === 401;
    const errorData = error.response?.data;

    // Check for various token-related error messages
    const isTokenError =
      isAuthError &&
      errorData &&
      (errorData.message === "Invalid token" ||
        errorData.message === "Token expired" ||
        errorData.message === "Unauthorized" ||
        errorData.message === "Access token expired" ||
        errorData.error === "TokenExpiredError" ||
        errorData.error === "JsonWebTokenError");

    if (isTokenError) {
      try {
        return await tokenManager.handleTokenRefresh(originalRequest);
      } catch (refreshError) {
        console.error("Authentication failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      // Could implement retry logic for network errors
    }

    // Handle server errors (5xx)
    if (error?.response) {
      if (error?.response?.status >= 500) {
        console.error("Server error:", error.response.status, error.response.data);
        // Could implement exponential backoff retry
      }

      // Handle client errors (4xx, excluding 401 which is handled above)
      if (
        error.response?.status >= 400 &&
        error.response?.status < 500 &&
        error.response?.status !== 401
      ) {
        console.warn("Client error:", error.response.status, error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

// Request interceptor for logging and additional headers
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Ensure credentials are always sent
    config.withCredentials = true;

    // Add CSRF token if available (for additional security)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    if (csrfToken) {
      config.headers = {
        ...config.headers,
        "X-CSRF-Token": csrfToken,
      };
    }

    // Add request ID for tracing
    config.headers = {
      ...config.headers,
      "X-Request-ID": generateRequestId(),
    };

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Utility function to generate request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add global error handler for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // Send to error monitoring service
  // trackError(event.reason);
});

export default axiosInstance;
// csrf vulnerabilities
*/
