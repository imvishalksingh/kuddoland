import { useAuthStore } from "../store/authStore";
import api from "./axios";

export async function ensureCsrfToken() {
  const { data } = await api.get("/auth/csrf");
  useAuthStore.getState().setCsrfToken(data.csrfToken);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function refreshSession() {
  const { data } = await api.post("/auth/refresh");
  return data;
}

export async function logoutRequest() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function logoutAllSessionsRequest() {
  const { data } = await api.post("/auth/logout-all");
  return data;
}

export async function forgotPassword(payload) {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
}

export async function resetPassword(payload) {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
}

export async function resendVerification(payload = {}) {
  const { data } = await api.post("/auth/resend-verification", payload);
  return data;
}

export async function verifyEmailRequest(payload) {
  const { data } = await api.post("/auth/verify-email", payload);
  return data;
}
