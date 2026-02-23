import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
