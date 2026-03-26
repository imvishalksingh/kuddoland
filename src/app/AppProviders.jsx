import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ensureCsrfToken, refreshSession } from "../api/auth.api";
import { queryClient } from "../lib/queryClient";
import { useAuthStore } from "../store/authStore";

export function AppProviders({ children }) {
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    let isMounted = true;

    const bootSession = async () => {
      try {
        await ensureCsrfToken();
      } catch {
        return;
      }

      const token = window.localStorage.getItem("kuddosland-access-token");
      if (!token || !isMounted) return;

      try {
        const response = await refreshSession();
        if (!isMounted) return;
        setSession({ user: response.user, accessToken: response.accessToken });
      } catch {
        if (!isMounted) return;
        logout();
      }
    };

    bootSession();

    return () => {
      isMounted = false;
    };
  }, [logout, setSession]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
