"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/services/auth.services";
import { access_key, user_token } from "@/constants";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, login, token } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      initialize();

      const savedToken = localStorage.getItem(access_key);
      if (!savedToken) return;

      try {
        const res = await authApi.getMe();
        login(res.data, savedToken);
      } catch {
        localStorage.removeItem(access_key);
        localStorage.removeItem(user_token);
      }
    };

    init();
  }, []);

  return <>{children}</>;
}
