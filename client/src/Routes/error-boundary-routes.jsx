import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './error-boundary';

const ErrorBoundaryRoutes = ({ children }) => {
  return (
    <Routes>
      <Route
        element={
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        }
      >
        {children}
      </Route>
    </Routes>
  );
};

export default ErrorBoundaryRoutes;
