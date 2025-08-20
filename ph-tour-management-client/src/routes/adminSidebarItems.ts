import AddDivision from "@/pages/admin/AddDivision";
import AddTour from "@/pages/admin/AddTour";
import AddTourType from "@/pages/admin/AddTourType";
import AllTours from "@/pages/admin/AllTours";
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
        title: "All Tours",
        url: "/admin/all-tours",
        Component: AllTours,
      },
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        Component: AddTour,
      },
      {
        title: "Add Tour Type",
        url: "/admin/add-tour-type",
        Component: AddTourType,
      },
      {
        title: "Add Division",
        url: "/admin/add-division",
        Component: AddDivision,
      },
    ],
  },
];
