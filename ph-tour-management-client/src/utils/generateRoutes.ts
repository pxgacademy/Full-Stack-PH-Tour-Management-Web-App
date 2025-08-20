//

import type { iSidebarItem } from "@/types";

export const generateRoutes = (sidebarItems: iSidebarItem[]) => {
  return sidebarItems.flatMap(({ items }) =>
    items.map(({ url, Component }) => ({ path: url, Component }))
  );
};
