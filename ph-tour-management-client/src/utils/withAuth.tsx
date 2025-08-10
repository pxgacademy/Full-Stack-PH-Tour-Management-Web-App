import useAuth from "@/hooks/useAuth";
import type { tRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate, useLocation } from "react-router";

export const withAuth = (Component: ComponentType, role?: tRole) => {
  return function () {
    const { pathname } = useLocation();
    const { user, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    if (!user || !user.email)
      return <Navigate to="/login" state={{ dest: pathname }} />;

    if (role !== user.role) return <Navigate to="/unauthorize" replace />;

    return <Component />;
  };
};
