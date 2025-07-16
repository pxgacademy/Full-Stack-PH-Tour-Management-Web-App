import { Router } from "express";
import authRoutes from "../app/modules/auth/auth.route";
import divisionRoutes from "../app/modules/division/division.route";
import userRoutes from "../app/modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/division",
    route: divisionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
