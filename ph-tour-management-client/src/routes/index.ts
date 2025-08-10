import App from "@/App";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { publicRoutes } from "./publicRoutes";
import { userSidebarItems } from "./userSidebarItems";

const adminRoutes = generateRoutes(adminSidebarItems);
const userRoutes = generateRoutes(userSidebarItems);

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
