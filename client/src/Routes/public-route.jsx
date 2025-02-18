import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicRoute = () => {
  const accessToken = useSelector((state) => state.auth.accessToken)

  return accessToken ? <Navigate to="/messages" /> : <Outlet />;
};
