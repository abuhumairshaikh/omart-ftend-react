import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  // eslint-disable-next-line no-unused-vars
  const { userInformation } = useSelector((state) => state?.auth);
  //userInformation && userInformation.isAdmin ?
  return <Outlet />;
  // ) : (
  //   <Navigate to={`/login`} replace />
  // );
};

export default AdminRoute;
