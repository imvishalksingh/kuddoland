import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(window.localStorage.getItem("kuddosland-user") || "null"),
  accessToken: window.localStorage.getItem("kuddosland-access-token"),
  csrfToken: window.localStorage.getItem("kuddosland-csrf-token"),
  setUser: (user) =>
    set(() => {
      window.localStorage.setItem("kuddosland-user", JSON.stringify(user));
      return { user };
    }),
  setAccessToken: (accessToken) =>
    set(() => {
      if (accessToken) window.localStorage.setItem("kuddosland-access-token", accessToken);
      else window.localStorage.removeItem("kuddosland-access-token");
      return { accessToken };
    }),
  setCsrfToken: (csrfToken) =>
    set(() => {
      if (csrfToken) window.localStorage.setItem("kuddosland-csrf-token", csrfToken);
      else window.localStorage.removeItem("kuddosland-csrf-token");
      return { csrfToken };
    }),
  setSession: ({ user, accessToken }) =>
    set(() => {
      window.localStorage.setItem("kuddosland-user", JSON.stringify(user));
      window.localStorage.setItem("kuddosland-access-token", accessToken);
      return { user, accessToken };
    }),
  logout: () =>
    set(() => {
      window.localStorage.removeItem("kuddosland-user");
      window.localStorage.removeItem("kuddosland-access-token");
      window.localStorage.removeItem("kuddosland-csrf-token");
      return { user: null, accessToken: null, csrfToken: null };
    }),
}));
