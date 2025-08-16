import Logo from "@/assets/icons/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ROLES } from "@/constants/role";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router";
import LoadingText from "../Loader/LoadingText";
import Logout from "../modules/logout/Logout";
import { ModeToggle } from "./Mode.Toggler";

const defaultLinks = [
  { href: "/", label: "Home", role: ROLES.PUBLIC },
  { href: "/tours", label: "Tours", role: ROLES.PUBLIC },
  { href: "/about", label: "About", role: ROLES.PUBLIC },
  { href: "/admin", label: "Dashboard", role: ROLES.ADMIN },
  { href: "/admin", label: "Dashboard", role: ROLES.SUPER_ADMIN },
  { href: "/user", label: "Dashboard", role: ROLES.USER },
];

export default function Navbar() {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return <LoadingText className="grid place-content-center mt-4" />;

  const navLinks = user
    ? defaultLinks.filter(({ role }) => role === "PUBLIC" || role === user.role)
    : defaultLinks.filter(({ role }) => role === "PUBLIC");

  return (
    <header className="border border-muted/70 px-4 py-5 sm:px-6 lg:px-8 container mx-auto rounded-2xl mt-3">
      <div className="flex justify-between gap-4">
        {/* Left side */}
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8" variant="ghost" size="icon">
                  <Logo />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navLinks.map(({ label, href }, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink asChild className="py-1.5">
                          <Link to={href}>{label}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>

          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-primary hover:text-primary/90">
              <Logo />
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="h-full *:h-full max-md:hidden">
              <NavigationMenuList className="h-full gap-2">
                {navLinks.map(({ label, href }, index) => (
                  <NavigationMenuItem key={index} className="h-full">
                    <NavigationMenuLink
                      asChild
                      className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                    >
                      <Link to={href}>{label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {!user ? (
            <Button asChild size="sm" className="text-sm ">
              <Link to="/login">Login</Link>
            </Button>
          ) : (
            <Logout />
          )}
        </div>
      </div>
    </header>
  );
}
