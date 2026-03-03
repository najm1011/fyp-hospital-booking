import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const AuthLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
