import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (formData: FormData) => Promise<any>;
  verifyEmail: (email: string, otp: string) => Promise<any>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  updateFollowerCount: (isFollowing: boolean) => void;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method,
        url: config.url,
      });
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("API Response:", {
        status: response.status,
      });
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("API Response Error:", {
        status: error.response?.status,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Update axios authorization header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token && !user && !isLoadingUser) {
        setIsLoadingUser(true);
        try {
          const res = await api.get("/auth/me");
          // Get posts count
          const statsRes = await api.get("/blogs/dashboard/stats");
          setUser({
            ...res.data,
            postsCount: statsRes.data.totalPosts || 0,
          });
        } catch (err) {
          console.error("Failed to load user:", err);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        } finally {
          setIsLoadingUser(false);
        }
      } else if (!token) {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with email:", email);
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", res.data);
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      setError(null);
      return res.data;
    } catch (err: any) {
      console.error("Login error details:", {
        response: err.response?.data,
        status: err.response?.status,
        error: err,
      });

      // Check if verification is required
      if (err.response?.data?.requiresVerification) {
        setError(null);
        return {
          requiresVerification: true,
          email: err.response.data.email,
          message: err.response.data.message,
        };
      }

      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "An error occurred during login";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (formData: FormData) => {
    try {
      const res = await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Registration failed");
      }

      // Check if verification is required
      if (res.data.requiresVerification) {
        setError(null);
        return res.data; // Return the response for verification handling
      }

      // If no verification required, proceed with login
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      setError(null);
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "An error occurred during registration";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post("/auth/forgot-password", { email });
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      const res = await api.post("/auth/verify-email", { email, otp });
      setError(null);

      // If verification successful and includes login data
      if (res.data.success && res.data.token) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
      }

      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "An error occurred during verification";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await api.post("/auth/resend-otp", { email });
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "An error occurred while resending OTP";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => setError(null);

  const updateFollowerCount = (isFollowing: boolean) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        following: isFollowing
          ? [...(prev.following || []), user?._id || ""]
          : (prev.following || []).filter((id) => id !== user?._id),
      };
    });
  };

  const updateUser = (userData: any) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        token,
        login,
        register,
        verifyEmail,
        resendOTP,
        logout,
        forgotPassword,
        resetPassword,
        clearError,
        updateFollowerCount,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
