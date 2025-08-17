import App from "@/App";
import { ROLES } from "@/constants/role";
import Payment from "@/pages/payment/Payment";
import Unauthorized from "@/pages/Unauthorized";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { paymentRoutes } from "./paymentRoutes";
import { publicRoutes } from "./publicRoutes";
import { userSidebarItems } from "./userSidebarItems";

const DashboardLayout = lazy(() => import("@/components/layouts/DashboardLayout"));
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

const paymentRoutesWithIndex = [{ index: true, element: <Navigate to="/" /> }, ...paymentRoutes];

const { SUPER_ADMIN, ADMIN, USER } = ROLES;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: publicRoutes,
  },

  {
    path: "admin",
    Component: withAuth(DashboardLayout, SUPER_ADMIN, ADMIN),
    children: adminRoutes,
  },

  {
    path: "user",
    Component: withAuth(DashboardLayout, SUPER_ADMIN, ADMIN, USER),
    children: userRoutes,
  },

  {
    path: "payment",
    Component: Payment,
    children: paymentRoutesWithIndex,
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

  {
    path: "unauthorized",
    Component: Unauthorized,
  },
]);
