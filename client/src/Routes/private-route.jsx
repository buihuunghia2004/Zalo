import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const accessToken = useSelector((state) => state.auth.accessToken)

  return accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
