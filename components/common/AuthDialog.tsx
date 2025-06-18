"use client"
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSession, signIn } from "next-auth/react";

function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-white border-white/30 hover:bg-white/20"
        >
          SignIn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Continue with Socials
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose your preferred sign in method
          </DialogDescription>
          <div className="flex items-center justify-center gap-x-4">
            <Button
              onClick={() => signIn("google")}
              variant="outline"
              className="h-12 text-base font-medium hover:bg-gray-100 transition-colors"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => signIn("github")}
              className="h-12 text-base font-medium hover:bg-gray-100 transition-colors"
            >
              <FaGithub className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default AuthDialog;
