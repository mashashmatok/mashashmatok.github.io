import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired, isAdmin } from 'utils/utils';

const PrivateRoute = () => {
  const auth = !isTokenExpired() && isAdmin();
  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
