import React, { createContext, useContext, useState, useEffect } from "react";

export type Gender = "female" | "male" | null;

interface User {
  name: string;
  gender: Gender;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUserState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user from localStorage:", e);
    }
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
        // Apply gender-based theme
        applyGenderTheme(user.gender);
      } catch (e) {
        console.error("Failed to save user to localStorage:", e);
      }
    }
  }, [user]);

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");
    document.documentElement.classList.remove("male-theme");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

// Helper function to apply gender-based theme
export const applyGenderTheme = (gender: Gender) => {
  if (gender === "male") {
    document.documentElement.classList.add("male-theme");
  } else {
    document.documentElement.classList.remove("male-theme");
  }
};

// Helper functions for username-based localStorage keys
export const getStorageKey = (username: string, type: "tasks" | "updates") => {
  return `${username}:${type}`;
};

export const getUserTasks = (username: string) => {
  try {
    const stored = localStorage.getItem(getStorageKey(username, "tasks"));
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load tasks for user:", e);
    return [];
  }
};

export const saveTasks = (username: string, tasks: any[]) => {
  try {
    localStorage.setItem(getStorageKey(username, "tasks"), JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks for user:", e);
  }
};

export const getUserUpdates = (username: string) => {
  try {
    return localStorage.getItem(getStorageKey(username, "updates")) || "";
  } catch (e) {
    console.error("Failed to load updates for user:", e);
    return "";
  }
};

export const saveUpdates = (username: string, updates: string) => {
  try {
    localStorage.setItem(getStorageKey(username, "updates"), updates);
  } catch (e) {
    console.error("Failed to save updates for user:", e);
  }
};
