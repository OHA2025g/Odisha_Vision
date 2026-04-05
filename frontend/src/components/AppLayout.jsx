import React from "react";
import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { RoleModalProvider } from "@/contexts/RoleModalContext";

export default function AppLayout() {
  return (
    <RoleModalProvider>
      <SiteHeader />
      <div className="pt-16">
        <Outlet />
      </div>
    </RoleModalProvider>
  );
}
