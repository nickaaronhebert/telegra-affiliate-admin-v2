import { Navigate } from 'react-router-dom';
import { getLocalStorage } from '@/lib/utils';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { ROUTES } from '@/constants/routes';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const token = getLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  if (token) {
    return <Navigate to={ROUTES.PATIENTS} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;