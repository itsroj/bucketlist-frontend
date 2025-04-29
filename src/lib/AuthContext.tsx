import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { authAPI } from "./api";
import { useNavigate } from "react-router-dom";

// User type definition
export interface User {
  id: string;
  firstName: string;
  email: string;
  createdAt?: string;
}

// Auth context state
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  error: string | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
  error: null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.verifyToken();

        if (response && response.isAuthenticated) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);

      if (response && response.user) {
        setUser(response.user);
        navigate("/dashboard");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    firstName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(firstName, email, password);

      if (response && response.user) {
        setUser(response.user);
        navigate("/dashboard");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    navigate("/");
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
