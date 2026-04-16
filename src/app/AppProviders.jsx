import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ensureCsrfToken, refreshSession } from "../api/auth.api";
import { queryClient } from "../lib/queryClient";
import { useAuthStore } from "../store/authStore";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthModal } from "../components/auth/AuthModal";

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
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <QueryClientProvider client={queryClient}>
          {children}
          <AuthModal />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}
