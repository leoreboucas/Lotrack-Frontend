import { useCan } from "@refinedev/core";
import { NavLink } from "react-router-dom";
import { Boxes, LayoutGrid } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { menuConfig } from "@/config/menuConfig";

const MenuItemLink = ({
  item,
}: {
  item: (typeof menuConfig)[number]["items"][number];
}) => {
  const { data } = useCan({ resource: item.resource, action: "list" });

  if (!data?.can) return null;

  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        className="h-10 rounded-md px-3 text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white data-[active=true]:bg-sidebar-primary data-[active=true]:text-white"
        render={
          <NavLink
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "bg-sidebar-primary text-white" : ""
            }
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </NavLink>
        }
      />
    </SidebarMenuItem>
  );
};

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 pb-4 pt-5 group-data-[collapsible=icon]:px-2">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Boxes className="size-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold tracking-wide text-white">
              LOTRACK
            </p>
            <p className="text-[10px] font-medium tracking-widest text-sidebar-foreground/55">
              OPERAÇÕES
            </p>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {menuConfig.map((group) => (
          <SidebarGroup key={group.section} className="px-3 py-2">
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-[0.12em] text-sidebar-foreground/45">
              {group.section.toUpperCase()}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <MenuItemLink key={item.path} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 rounded-md border border-sidebar-border/60 bg-sidebar-accent/30 p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
          <LayoutGrid className="size-4 shrink-0 text-sidebar-foreground/70" />
          <span className="text-xs text-sidebar-foreground/65 group-data-[collapsible=icon]:hidden">
            v1.0.0
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
