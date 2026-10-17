import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { hasRole } from "../utils/authorization";

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && !hasRole(user, requiredRole)) {
    return (
      <main className="access-denied">
        <h1>Access denied</h1>
        <p>You do not have permission to access this page.</p>
      </main>
    );
  }

  return children;
}

export default ProtectedRoute;
