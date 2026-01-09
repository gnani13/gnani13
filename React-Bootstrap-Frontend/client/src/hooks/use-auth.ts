import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { useLocation } from "wouter";
import { 
  type LoginCredentials, 
  type InsertUser, 
  type User, 
  type AuthResponse 
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Helper to get user from local storage initially
const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Mock user for local development when backend is unavailable
const MOCK_USER: User = {
  id: 1,
  email: "donor@example.com",
  name: "Sample Donor",
  role: "DONOR",
  password: "password123"
};

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const res = await api.get<User>('/api/auth/profile');
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      } catch (error) {
        // Fallback to stored user if network fails but token exists
        return getStoredUser();
      }
    },
    initialData: getStoredUser(),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log("Attempting login with:", credentials);
      const res = await api.post<AuthResponse>('/api/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Login success:", data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
      setLocation('/dashboard');
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      console.log("Attempting register with:", data);
      const res = await api.post<AuthResponse>('/api/auth/register', data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Register success:", data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
      setLocation('/dashboard');
      toast({
        title: "Account created!",
        description: "Welcome to ReNourish.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Could not create account",
        variant: "destructive",
      });
    }
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.setQueryData(['auth', 'user'], null);
    setLocation('/login');
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
