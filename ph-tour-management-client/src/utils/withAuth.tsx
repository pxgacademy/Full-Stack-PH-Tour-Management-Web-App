import Loading from "@/components/Loader/Loading";
import useAuth from "@/hooks/useAuth";
import type { ComponentType } from "react";
import { Navigate, useLocation } from "react-router";

export const withAuth = (Component: ComponentType, ...roles: string[]) => {
  return function () {
    const { pathname } = useLocation();
    const { user, isLoading } = useAuth();

    if (isLoading) return <Loading />;

    if (!user || !user.email) {
      return <Navigate to="/login" state={{ dest: pathname }} />;
    }

    if (!roles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component />;
  };
};
