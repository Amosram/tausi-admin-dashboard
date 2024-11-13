import React from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { SidebarProvider } from "../ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background">
      <SidebarProvider className="flex">
        <SideBar />

        <div className="flex flex-col flex-1">
          <Header />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
