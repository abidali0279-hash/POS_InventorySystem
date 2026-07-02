import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar
        toggleSidebar={() =>
          setSidebarOpen(!sidebarOpen)
        }
      />

      <div className="flex">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto">

          {children}

        </main>

      </div>

    </div>

  );

}

export default Layout;