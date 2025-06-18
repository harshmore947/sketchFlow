"use client";

import Dashboard from "@/components/common/Dashboard";
import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React, { useState } from "react";

function page() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex justify-center h-screen px-6 py-2">
      <div className="flex relative rounded-2xl w-full bg-gradient-to-br from-[#1a1a1a] to-[#222222]">
        {/* sidebar */}
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

        {/* button when the side bar is closed */}
        <div>
          {!isOpen && (
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => setIsOpen(true)}
              className="top-4 left-4 z-20 text-white hover:bg-white/10 rounded-lg"
            >
              <Menu />
            </Button>
          )}
        </div>

        {/* Dashboard */}
        <Dashboard />
      </div>
    </div>
  );
}

export default page;


