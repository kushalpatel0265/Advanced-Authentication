import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/api/auth/check-auth');
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      // If it's a 401, it just means the user isn't logged in
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.error('Auth check failed:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (data.success) {
        setUser(data.user);
        toast.success('Logged in successfully');
        router.push('/dashboard');
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const signup = async ({ name, email, password }) => {
    try {
      const { data } = await api.post('/api/auth/signup', { 
        name, 
        email, 
        password 
      });

      if (data.success) {
        toast.success('Account created successfully!');
        // Redirect to verification pending page with email
        router.push(`/verification-pending?email=${encodeURIComponent(email)}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in signup:', error);
      const message = error.response?.data?.message || 'Something went wrong during signup';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { data } = await api.post('/api/auth/logout');
      if (data.success) {
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error.message);
      toast.error('Logout failed');
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      if (data.success) {
        toast.success('Password reset email sent');
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
      if (data.success) {
        toast.success('Password reset successful');
        router.push('/login');
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
      throw error;
    }
  };

  const value = {
    user,
    setUser, // Expose setUser
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    api, // Expose the api instance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
