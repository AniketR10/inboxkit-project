import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 bg-white border-b-2 border-black flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <Link href="/" className="flex items-center gap-x-2 group">
          <div className="h-8 w-8 bg-accent text-white flex items-center justify-center font-bold text-lg border-2 border-black group-hover:bg-highlight group-hover:text-black transition-colors">
            H
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block group-hover:text-accent transition-colors">
            Hintero
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-x-2">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="h-auto rounded-none border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-neo transition-all hover:bg-highlight hover:-translate-y-1">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
              }
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
};