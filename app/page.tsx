import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Navbar } from "@/components/Navbar"; 
import { CreateForm } from "@/components/create-form";
import { SearchInput } from "@/components/search-input";
import { DeleteBoardButton } from "@/components/delete-board-btn";
import { Board } from "@prisma/client";

interface HomeProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/login");
  }
  
  const userId = session.userId;

  const params = await searchParams;
  const query = params?.query || "";
  const page = Number(params?.page) || 1;
  const PAGE_SIZE = 8;

  const whereCondition = {
    ownerId: userId,
    title: {
      contains: query,
      mode: "insensitive" as const,
    }
  };

  const boards = await prisma.board.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: "desc",
    },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const totalBoards = await prisma.board.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(totalBoards / PAGE_SIZE);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 md:pt-32 px-4 max-w-6xl mx-auto pb-20">
        
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="bg-highlight text-black border-2 border-black px-4 py-1 font-bold shadow-neo transform -rotate-2">
            TASK MANAGEMENT SIMPLIFIED
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight mb-2">
            Task Master.
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl font-medium">
            A lightweight collaboration tool designed for speed. No clutter, just boards.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b-2 border-black pb-6">
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            Your Boards
            <span className="w-3 h-3 bg-accent border border-black rounded-full"></span>
          </h2>

          <div className="w-full md:w-72">
            <SearchInput placeholder="Search your boards..." />
          </div>
        </div>

        {boards.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              
             {boards.map((board: Board) => (
                <div key={board.id} className="relative group"> 
                  
                  <Link
                    href={`/board/${board.id}`}
                    className=" group relative h-32 bg-white border-2 border-black shadow-neo p-4 flex flex-col justify-between transition-all hover:-translate-y-1 hover:bg-highlight"
                  >
                    <div className="font-black text-lg truncate pr-6"> 
                      {board.title}
                    </div>
                    <div className="text-xs font-bold text-neutral-400 group-hover:text-black">
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                  </Link>

                  <div className="absolute top-2 right-2 z-10">
                    <DeleteBoardButton boardId={board.id} />
                  </div>

                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-x-6 py-4">
                <Link
                  href={`/?query=${query}&page=${page - 1}`}
                  className={`px-4 py-2 bg-white border-2 border-black shadow-sm font-bold text-sm ${
                    !hasPrevPage
                      ? "opacity-50 pointer-events-none"
                      : "hover:shadow-neo hover:-translate-y-0.5 transition-all"
                  }`}
                >
                  ← Previous
                </Link>

                <span className="font-black text-lg">
                  Page {page} of {totalPages}
                </span>

                <Link
                  href={`/?query=${query}&page=${page + 1}`}
                  className={`px-4 py-2 bg-white border-2 border-black shadow-sm font-bold text-sm ${
                    !hasNextPage
                      ? "opacity-50 pointer-events-none"
                      : "hover:shadow-neo hover:-translate-y-0.5 transition-all"
                  }`}
                >
                  Next →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-black border-dashed bg-white p-10">
            {query ? (
              <>
                <p className="text-lg font-bold">
                  No boards match "{query}"
                </p>
                <Link
                  href="/"
                  className="text-sm text-accent underline mt-2 font-bold"
                >
                  Clear Search
                </Link>
              </>
            ) : (
              <>
                <p className="text-lg font-bold">No boards found</p>
                <p className="text-sm text-neutral-500 mb-6">
                  Start by creating your first workspace
                </p>
                <div className="w-full max-w-xs">
                  <CreateForm />
                </div>
              </>
            )}
          </div>
        )}

        {!query && boards.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-20">
            <h3 className="font-bold text-xl mb-6 bg-white px-6 py-2 border-2 border-black shadow-neo -translate-x-1 lg:-translate-x-0">
              Create a New Board
            </h3>

            <div className="w-full max-w-md">
              <CreateForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}