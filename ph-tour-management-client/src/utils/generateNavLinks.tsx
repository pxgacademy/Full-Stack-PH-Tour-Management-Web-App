import { ROLES } from "@/constants/role";
import useAuth from "@/hooks/useAuth";
import type { iUserInfo } from "@/types";
import { useMemo } from "react";

interface iNavLinks {
  href: string;
  label: string;
  role: string;
}

const defaultLinks = [
  { href: "/", label: "Home", role: ROLES.PUBLIC },
  { href: "/about", label: "About", role: ROLES.PUBLIC },
  { href: "/admin", label: "Dashboard", role: ROLES.ADMIN },
  { href: "/admin", label: "Dashboard", role: ROLES.SUPER_ADMIN },
  { href: "/user", label: "Dashboard", role: ROLES.USER },
];

export const GenerateNavLinks = (): {
  navLinks: iNavLinks[];
  user: iUserInfo | null;
} => {
  const { user, isLoading } = useAuth();

  const filteredLinks = useMemo(() => {
    if (isLoading) return [];

    if (user) {
      return defaultLinks.filter(
        ({ role }) => role === "PUBLIC" || role === user.role
      );
    }

    return defaultLinks.filter(({ role }) => role === "PUBLIC");
  }, [user, isLoading]);

  return { navLinks: filteredLinks, user };
};
