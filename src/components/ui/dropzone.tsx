/* COMPONENTS */
"use client";

import React from "react";

type MenuItemProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

function MenuItem({ children, active, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`uppercase tracking-widest p-1 cursor-pointer outline-none ${
        active
          ? "text-white border-b-2 border-white"
          : "text-white/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function SubItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`px-3 py-2 border ${
        active
          ? "border-white/40 bg-white/10"
          : "border-white/10 hover:bg-white/5"
      } text-sm`}
    >
      {children}
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/20 bg-white/5 backdrop-blur p-4">
      <h3 className="text-xs tracking-widest text-white/60 mb-3 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-white/50">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export { MenuItem, SubItem, Panel, InfoRow };