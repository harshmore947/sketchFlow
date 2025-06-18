"use client";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "../mode-toggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthDialog from "./AuthDialog";
import Logo from "./Logo";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 60) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  if (status === "loading") return null;

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: -100 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 right-0 left-0 z-50 flex justify-center"
    >
      <motion.div
        variants={{
          visible: {
            padding: "1rem 2rem",
            marginTop: "1rem",
          },
          hidden: {
            padding: "0.5rem 2rem",
            marginTop: "0.5rem",
          },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="w-[90%] max-w-6xl 
                  bg-white/20 backdrop-blur-md 
                  border border-white/30 shadow-lg rounded-2xl
                  flex justify-between items-center"
      >
        {/* Logo Section */}
        <div
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/dashboard")}
        >
          <Logo size="md" />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center gap-x-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-gray-300">{session.user.email}</p>
              </div>
              <Image
                src={session.user.image || ""}
                alt={session?.user?.name || "user"}
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-white/20"
              />
            </div>
          ) : (
            <AuthDialog />
          )}
          <ModeToggle />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Navbar;
