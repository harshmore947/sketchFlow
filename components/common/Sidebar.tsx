"use client";

import React from "react";
import { Button } from "../ui/button";
import { Plus, Folder, Star, Archive, Settings, LogOut } from "lucide-react";
import { Separator } from "../ui/separator";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled",
          content: {
            elements: [],
            appState: {},
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/workspace/${data.id}`);
        onClose();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-full 
      ${isOpen ? "w-64" : "w-0"} 
      overflow-hidden border-r border-white/10 
      bg-black/20 backdrop-blur-xl
      flex flex-col`}
    >
      {/* User Profile Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {session?.user?.name?.[0] || "U"}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {session?.user?.name || "User"}
            </span>
            <span className="text-xs text-gray-400">
              {session?.user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <Button
          className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-600"
          onClick={handleCreateNote}
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>

        <Separator className="my-4" />

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white hover:bg-white/10"
            onClick={() => {
              router.push("/dashboard");
              onClose();
            }}
          >
            <Folder className="h-4 w-4" />
            All Notes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white hover:bg-white/10"
            onClick={() => {
              router.push("/dashboard?filter=starred");
              onClose();
            }}
          >
            <Star className="h-4 w-4" />
            Starred
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white hover:bg-white/10"
            onClick={() => {
              router.push("/dashboard?filter=archived");
              onClose();
            }}
          >
            <Archive className="h-4 w-4" />
            Archived
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-white/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
