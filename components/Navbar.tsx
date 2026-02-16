import Link from "next/link";
import { auth } from "@/lib/auth"; 
import { logoutAction } from "@/actions/logout";

export const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center z-50">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        
        <div className="hidden md:flex">
          <Link href="/" className="font-black text-xl tracking-tighter hover:opacity-75 transition">
            TASK MASTER
          </Link>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          
          <div className="flex items-center gap-x-2">
             <Link 
               href="/" 
               className="hidden md:block bg-black text-white text-sm font-bold py-1.5 px-3 rounded-sm hover:opacity-80 transition"
             >
               My Boards
             </Link>
          </div>

          <div className="flex items-center gap-x-3">
             {user && (
               <div className="flex items-center gap-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs border-2 border-black">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-bold hidden md:block">
                    {user.name}
                  </span>
               </div>
             )}

             <form action={logoutAction}>
                <button className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-red-600 border-l-2 border-neutral-200 pl-3 ml-2 transition-colors">
                   Log out
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};