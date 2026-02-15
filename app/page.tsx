import { Navbar } from "@/components/Navbar";
import { CreateForm } from "@/actions/create-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-20 md:pt-32 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          
          <div className="bg-highlight text-black border-2 border-black px-4 py-1 font-bold shadow-neo transform -rotate-2">
            TASK MANAGEMENT SIMPLIFIED
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight mb-2">
            Work Forward.
          </h1>
          
          <p className="text-lg text-neutral-600 max-w-2xl font-medium">
             A lightweight collaboration tool designed for speed. 
             No clutter, just boards.
          </p>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
            <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                Your Boards
                <span className="w-3 h-3 bg-accent border border-black rounded-full"></span>
            </h2>
          </div>

          <div className="h-full flex flex-col items-center justify-center border-2 border-black border-dashed bg-white p-10">
            <p className="text-lg font-bold">No boards found</p>
            <p className="text-sm text-neutral-500 mb-6">Start by creating your first workspace</p>
            
            <CreateForm />
            
          </div>
        </div>
      </main>
    </div>
  );
}