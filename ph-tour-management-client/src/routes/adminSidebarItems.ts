import AddTour from "@/pages/admin/AddTour";
import Analytics from "@/pages/admin/Analytics";
import type { iSidebarItem } from "@/types";

export const adminSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        Component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        Component: AddTour,
      },
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        Component: AddTour,
      },
    ],
  },
];
