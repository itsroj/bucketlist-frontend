// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Token helpers
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

// API request helper with auth header
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 unauthorized errors
    if (response.status === 401) {
      removeToken();
      // Force login page redirect if needed
      window.location.href = "/";
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// File upload helper with auth header
const uploadFile = async (endpoint: string, file: File) => {
  const token = getToken();

  // Create FormData and append the file
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    // Handle 401 unauthorized errors
    if (response.status === 401) {
      removeToken();
      // Force login page redirect if needed
      window.location.href = "/";
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("Upload request error:", error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await authFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data && data.token) {
      setToken(data.token);
    }

    return data;
  },

  register: async (firstName: string, email: string, password: string) => {
    const data = await authFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstName, email, password }),
    });

    if (data && data.token) {
      setToken(data.token);
    }

    return data;
  },

  verifyToken: async () => {
    const token = getToken();
    if (!token) return null;

    try {
      return await authFetch("/auth/verify");
    } catch (error) {
      removeToken();
      return null;
    }
  },

  logout: () => {
    removeToken();
  },
};

// Bucket list API functions
export const bucketListAPI = {
  getEntries: () => authFetch("/bucket-list"),

  getEntry: (id: string) => authFetch(`/bucket-list/${id}`),

  createEntry: (entry: any) =>
    authFetch("/bucket-list", {
      method: "POST",
      body: JSON.stringify(entry),
    }),

  updateEntry: (id: string, entry: any) =>
    authFetch(`/bucket-list/${id}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    }),

  toggleCompletion: (id: string) =>
    authFetch(`/bucket-list/${id}/toggle`, {
      method: "PATCH",
    }),

  deleteEntry: (id: string) =>
    authFetch(`/bucket-list/${id}`, {
      method: "DELETE",
    }),
};

// Profile API functions
export const profileAPI = {
  getProfile: () => authFetch("/profile"),

  updateProfile: (firstName: string, currentPassword: string) =>
    authFetch("/profile", {
      method: "PUT",
      body: JSON.stringify({ firstName, currentPassword }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    authFetch("/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  deleteAccount: (password: string) =>
    authFetch("/profile", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    }),
};

// Chatbot API functions
export const chatbotAPI = {
  // Get chat history
  getChatHistory: () => authFetch("/chatbot/history"),

  // Send a new message
  sendMessage: (message: string) =>
    authFetch("/chatbot/message", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  // Clear chat history
  clearChatHistory: () =>
    authFetch("/chatbot/history", {
      method: "DELETE",
    }),
};

// Upload API functions
export const uploadAPI = {
  // Upload an image to Cloudinary
  uploadImage: (file: File) => uploadFile("/upload/image", file),
};
