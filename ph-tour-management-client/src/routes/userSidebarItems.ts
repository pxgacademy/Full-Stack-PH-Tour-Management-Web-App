import Bookings from "@/pages/user/Bookings";
import type { iSidebarItem } from "@/types";

export const userSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Bookings",
        url: "/user/bookings",
        Component: Bookings,
      },
    ],
  },
];
