import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { CreateForm } from "@/components/create-form";

export default async function Home() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // 1. Fetch the boards for the current user
  const boards = await prisma.board.findMany({
    where: {
      orgId: orgId || userId, // Match boards created by this user
    },
    orderBy: {
      createdAt: "desc", // Newest first
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 md:pt-32 px-4 max-w-6xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="bg-highlight text-black border-2 border-black px-4 py-1 font-bold shadow-neo transform -rotate-2">
            TASK MANAGEMENT SIMPLIFIED
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight mb-2">
            Work Forward.
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl font-medium">
            A lightweight collaboration tool designed for speed. No clutter, just boards.
          </p>
        </div>

        {/* Boards Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-2">
            <h2 className="text-2xl font-bold text-black flex items-center gap-2">
              Your Boards
              <span className="w-3 h-3 bg-accent border border-black rounded-full"></span>
            </h2>
          </div>

          {/* CONDITIONAL RENDERING: Logic to show boards or empty state */}
          {boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              
              {/* 2. Map through existing boards */}
              {boards.map((board) => (
                <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className="group relative h-32 bg-white border-2 border-black shadow-neo p-4 flex flex-col justify-between transition-all hover:-translate-y-1 hover:bg-highlight"
                >
                  <div className="font-black text-lg truncate pr-2">
                    {board.title}
                  </div>
                  <div className="text-xs font-bold text-neutral-400 group-hover:text-black">
                    {new Date(board.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}

              {/* 3. A "Create New" Card that sits in the grid */}
              <div className="h-32 border-2 border-dashed border-black bg-neutral-100 p-4 flex flex-col items-center justify-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                 <p className="text-xs font-bold">Create another board below</p>
                 <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center font-bold">↓</div>
              </div>

            </div>
          ) : (
            /* EMPTY STATE: Only shown if 0 boards exist */
            <div className="h-64 flex flex-col items-center justify-center border-2 border-black border-dashed bg-white p-10">
              <p className="text-lg font-bold">No boards found</p>
              <p className="text-sm text-neutral-500 mb-6">
                Start by creating your first workspace
              </p>
              <CreateForm />
            </div>
          )}

          {/* Always show the Create Form at the bottom if boards exist, so user can add more */}
          {boards.length > 0 && (
            <div className="mt-12 flex flex-col items-center border-t-2 border-black/10 pt-8">
                <h3 className="font-bold text-lg mb-4">Create a New Board</h3>
                <CreateForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}