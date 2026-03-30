import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container" style={{ padding: 24 }}>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
}