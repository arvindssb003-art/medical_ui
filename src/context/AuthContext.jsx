import { useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authApi";
import { getUserProfile } from "../services/userApi";
import { AuthContext } from "./AuthContextValue";

function getStoredUser() {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid stored user data:", error);
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );

  useEffect(() => {
    const handleSessionExpired = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    const profile = await getUserProfile();

    localStorage.setItem("user", JSON.stringify(profile));

    setUser(profile);

    return { ...data, user: profile };
  };

  const register = async (userData) => {
    return await registerUser(userData);
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        register,
        logout,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
