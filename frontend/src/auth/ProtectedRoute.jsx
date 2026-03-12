import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { hasRole } from "../utils/roleUtils";

function ProtectedRoute({ children, roles = [] }) {

  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container py-4">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !hasRole(user, roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;