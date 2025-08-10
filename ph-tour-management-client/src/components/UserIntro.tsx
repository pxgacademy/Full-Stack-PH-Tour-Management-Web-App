import Logo from "@/assets/icons/logo";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface iProps {
  name: string;
  email: string;
}

export function UserIntro({ name, email }: iProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Logo />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium line-clamp-1">{name}</span>
            <span className="text-muted-foreground line-clamp-1">{email}</span>
          </div>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
