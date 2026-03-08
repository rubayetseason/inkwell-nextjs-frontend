"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/services/auth.services";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, login, token } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Refresh user data on mount if token exists
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      authApi
        .getMe()
        .then((res) => {
          login(res.data, savedToken);
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  return <>{children}</>;
}
