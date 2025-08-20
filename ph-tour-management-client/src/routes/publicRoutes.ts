import About from "@/pages/About";
import Home from "@/pages/Home";
import Bookings from "@/pages/user/Bookings";
import TourDetails from "@/pages/user/TourDetails";
import Tours from "@/pages/user/Tours";
import { withAuth } from "@/utils/withAuth";

export const publicRoutes = [
  {
    Component: Home,
    index: true,
  },
  {
    Component: Tours,
    path: "tours",
  },
  {
    Component: TourDetails,
    path: "tours/:slug",
  },
  {
    Component: withAuth(Bookings),
    path: "bookings/:slug",
  },
  {
    Component: About,
    path: "about",
  },
];
