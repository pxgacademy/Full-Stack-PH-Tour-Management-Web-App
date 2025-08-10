import { ROLES } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { tRole } from "@/types";

const { SUPER_ADMIN, ADMIN, MODERATOR, USER } = ROLES;

export const getSidebarItems = (role: tRole) => {
  switch (role) {
    case SUPER_ADMIN || ADMIN || MODERATOR:
      return [...adminSidebarItems, ...userSidebarItems];

    case USER:
      return userSidebarItems;

    default:
      return [];
  }
};
