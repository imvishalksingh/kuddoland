import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function RouteGuard({ children, requireAdmin = false }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to={requireAdmin ? "/login?role=admin" : "/login"} replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/account" replace />;
  }

  return children;
}
