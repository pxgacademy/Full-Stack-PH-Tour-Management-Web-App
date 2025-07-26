import { Router } from "express";
import authRoutes from "../app/modules/auth/auth.route";
import bookingRoutes from "../app/modules/booking/booking.route";
import divisionRoutes from "../app/modules/division/division.route";
import otpRoutes from "../app/modules/otp/otp.route";
import paymentRoutes from "../app/modules/payment/payment.route";
import tourRoutes from "../app/modules/tour/tour.route";
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
  {
    path: "/tours",
    route: tourRoutes,
  },
  {
    path: "/bookings",
    route: bookingRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
