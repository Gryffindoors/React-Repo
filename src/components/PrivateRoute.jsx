import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!user && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
