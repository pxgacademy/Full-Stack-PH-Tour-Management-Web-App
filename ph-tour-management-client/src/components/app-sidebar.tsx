import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserIntro } from "@/components/UserIntro";
import { ROLES } from "@/constants/role";
import useAuth from "@/hooks/useAuth";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { Link, useLocation, useNavigate } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return navigate("/login", { state: { dest: pathname } });

  // const navItems = getSidebarItems(user.role as tRole);
  const navItems = getSidebarItems(ROLES.SUPER_ADMIN);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserIntro
          name={`${user.name?.firstName} ${user.name?.lastName}`}
          email={user.email}
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {navItems.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map(({ title, url }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild isActive={pathname === url}>
                      <Link to={url}>{title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
