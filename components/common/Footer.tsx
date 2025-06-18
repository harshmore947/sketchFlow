import React from "react";
import { Github } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-[#1a1a1a] border-t border-white/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Harsh. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/harshmore947"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
