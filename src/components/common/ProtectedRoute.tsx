import { Navigate } from 'react-router-dom';
import { getLocalStorage } from '@/lib/utils';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;