import { useGetIdentity, useLogout } from "@refinedev/core";
import { Moon, Sun, Bell, ChevronDown, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { AppSidebar } from "./appSidebar";
import { useColorMode } from "../context/colorMode";
import { NotificationsBell } from "@/components/notificationBells";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


type Identity = {
  id: string;
  role: string;
};

export const AppLayout = () => {
  const { data: identity } = useGetIdentity<Identity>();
  const { mode, setMode } = useColorMode();

  const role = identity?.role ?? "Usuário";
  const initials = role.slice(0, 2).toUpperCase();

  const { mutate: logout } = useLogout();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="bg-background">
        <header className="flex h-16 items-center justify-between border-b bg-card px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="hidden h-5 w-px bg-border sm:block" />
            <p className="hidden text-sm text-muted-foreground sm:block">
              Gestão de estoque
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={setMode}
              aria-label={
                mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
            >
              {mode === "dark" ? <Sun /> : <Moon />}
            </Button>

            <NotificationsBell />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-accent" />
                }
              >
                <Avatar className="size-8 border border-border">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:block">
                  {role}
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {role}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
