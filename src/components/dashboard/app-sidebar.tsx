"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Session } from "@/interfaces/session";

import logoutAction from "@/utils/auth/logoutAction";
import { getFirstTwoNames } from "@/utils/getFirstTwoNames";

import { getInitials } from "@/utils/getInitials";

import {
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsGear } from "react-icons/bs";
import { GiShieldcomb } from "react-icons/gi";
import { LuFactory } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { CgPlayListSearch } from "react-icons/cg";

const items = [
  {
    title: "MAIN MENU",
    url: "/",
    icon: RxDashboard,
  },
  {
    title: "MATCHES",
    url: "/beta",
    icon: CgPlayListSearch,
  },
  {
    title: "ARSENAL MANAGER",
    url: "/manager",
    icon: GiShieldcomb,
  },
  {
    title: "ECONOMY MANAGER",
    url: "/docking",
    icon: LuFactory,
  },
  {
    title: "",
    url: "/definicoes",
    icon: BsGear,
  },
];

export function AppSidebar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
    }

    fetchSession();
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible={"icon"} variant={"sidebar"} className="h-[3rem] w-[100%]">
        <SidebarContent className="overflow-hidden h-1 flex items-center justify-center align-middle">
          <SidebarGroup className="p-0 flex items-center justify-center align-middle">
            <SidebarGroupContent className="bg-[#fc5c00] relative flex items-center justify-center align-middle">
              <SidebarMenu className="grid grid-cols-7 gap-1 w-[100%] bg-transparent">
                {items.map((item) => (
                  <SidebarMenuItem className="bg-transparent p-0" key={item.title}>
                    <SidebarMenuButton className="h-full" asChild>
                      <Link href={`/dashboard${item.url}`}>
                        <item.icon />
                        <span className="text-[14px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  ))}
                  <SidebarMenuButton onClick={logoutAction}>
                    <LogOut /> Sair
                  </SidebarMenuButton>
              <SidebarGroupLabel className="bg-transparent flex h-fit gap-2">
                  <Avatar className="h-full">
                    <AvatarImage src="user.png" />
                    <AvatarFallback className="bg-[#000000] text-[#dcdcdc] text-2xl font-bold">
                      {session ? (
                        getInitials(session?.user?.name)
                      ) : (
                        <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg">
                      {session
                        ? getFirstTwoNames(session?.user?.name)
                        : "Carregando..."}
                    </h3>
                    <p>Usuario</p>
                  </div>
                </SidebarGroupLabel>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}