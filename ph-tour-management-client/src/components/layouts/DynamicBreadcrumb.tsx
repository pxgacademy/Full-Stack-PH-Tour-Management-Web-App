import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router";

export default function DynamicBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;
          const label = decodeURIComponent(segment)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <BreadcrumbItem key={href}>
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={href}>{label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/*

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  edit: "Edit User",
};


const label = labelMap[segment] ?? segment;
*/
