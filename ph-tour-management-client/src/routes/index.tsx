import App from "@/App";
import { generateRoutes } from "@/utils/generateRoutes";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { publicRoutes } from "./publicRoutes";
import { userSidebarItems } from "./userSidebarItems";

const DashboardLayout = lazy(
  () => import("@/components/layouts/DashboardLayout")
);
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Verify = lazy(() => import("@/pages/Verify"));

const adminRoutes = [
  { index: true, element: <Navigate to="/admin/analytics" /> },
  ...generateRoutes(adminSidebarItems),
];

const userRoutes = [
  { index: true, element: <Navigate to="/user/bookings" /> },
  ...generateRoutes(userSidebarItems),
];

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: publicRoutes,
  },

  {
    path: "admin",
    Component: DashboardLayout,
    children: adminRoutes,
  },

  {
    path: "user",
    Component: DashboardLayout,
    children: userRoutes,
  },

  {
    path: "login",
    Component: Login,
  },

  {
    path: "register",
    Component: Register,
  },

  {
    path: "verify",
    Component: Verify,
  },
]);
