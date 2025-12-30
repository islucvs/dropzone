"use client";

import logoutAction from "@/utils/auth/logoutAction";
import React, { useState } from "react";
import { Panel, MenuItem, SubItem, InfoRow } from "@/components/ui/dropzone";
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

type MenuKey =
  | "deploy"
  | "loadout"
  | "specialists"
  | "vehicles"
  | "collection"
  | "settings";

export default function MyApp() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("deploy");
  const [activeSub, setActiveSub] = useState<string>("");

  const subMenus: Record<MenuKey, string[]> = {
    deploy: ["Spawn Overview", "Squads", "Insertion Points", "Map Intel"],
    loadout: ["Weapons", "Gadgets", "Equipment", "Skins"],
    specialists: ["Assault", "Engineer", "Support", "Recon"],
    vehicles: ["Land", "Air", "Naval"],
    collection: ["Weapons", "Vehicles", "Badges"],
    settings: ["Controls", "Audio", "Video", "Gameplay"],
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden text-white bg-cover bg-center font-sans"
      style={{ backgroundImage: "url(/images/serverroom.png)" }}
    >
      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2933,transparent_70%)]" />
      <div className="absolute inset-0 hud-scanlines pointer-events-none" />

      <div className="relative z-10 w-full h-full grid grid-rows-[auto_auto_1fr_auto] p-6">

        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-white/20 pb-3">
          <h1 className="tracking-[0.35em] text-lg font-bold">DROPZONE</h1>
          <SidebarMenuButton onClick={logoutAction}>
            <LogOut /> Sair
          </SidebarMenuButton>
          <div className="flex gap-8 text-xs text-white/70 uppercase">
            <span>Server US-04</span>
            <span>128 Players</span>
            <span className="text-green-400">Live</span>
          </div>
        </header>

        {/* PRIMARY MENU */}
        <nav className="flex gap-10 text-sm mt-4 border-b border-white/20 pb-3">
          {(
            [
              ["deploy", "Deploy"],
              ["loadout", "Loadout"],
              ["specialists", "Specialists"],
              ["vehicles", "Vehicles"],
              ["collection", "Collection"],
              ["settings", "Settings"],
            ] as [MenuKey, string][]
          ).map(([key, label]) => (
            <MenuItem
              key={key}
              active={activeMenu === key}
              onClick={() => {
                setActiveMenu(key);
                setActiveSub("");
              }}
            >
              {label}
            </MenuItem>
          ))}
        </nav>

        {/* CONTENT */}
        <main className="grid grid-cols-12 gap-6 mt-6 cursor-pointer">

          {/* LEFT – SUBMENUS */}
          <section className="col-span-3">
            <Panel title={`${activeMenu} Options`}>
              {subMenus[activeMenu].map((item) => (
                <SubItem
                  key={item}
                  active={activeSub === item}
                  onClick={() => setActiveSub(item)}
                >
                  {item}
                </SubItem>
              ))}
            </Panel>
          </section>

          {/* CENTER – MAIN PANEL */}
          <section className="col-span-6 relative border border-white/20 bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="relative h-full p-6 flex flex-col justify-end">
              <h2 className="text-4xl font-extrabold tracking-widest uppercase">
                {activeMenu}
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {activeSub || "Select an option to continue."}
              </p>
            </div>
          </section>

          {/* RIGHT – CONTEXT */}
          <section className="col-span-3 space-y-4">
            <Panel title="Context">
              <InfoRow label="Menu" value={activeMenu} />
              <InfoRow label="Submenu" value={activeSub || "-"} />
            </Panel>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="flex justify-between text-xs text-white/40 pt-4 border-t border-white/20">
          <span>© {new Date().getFullYear()} DROPZONE TACTICAL SYSTEMS</span>
          <span>BUILD vBETA</span>
        </footer>
      </div>
    </div>
  );
}
