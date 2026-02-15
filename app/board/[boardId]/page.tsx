import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

interface BoardIdPageProps {
    params: Promise<{
        boardId: string;
    }>;
}

export default async function BoardIdPage ({
    params, 
}: BoardIdPageProps) {
    const resParams = await params;
    const boardId = resParams.boardId;

    const {userId} = await auth();

    if(!userId) {
        redirect("/");
    }

    const board = await prisma.board.findUnique({
        where: {
            id: boardId,
        },
    });

    if(!board) {
        redirect("/");
    }

    return (
        <div className="p-4 h-full bg-slate-50 min-h-screen">
       <div className="bg-white border-2 border-black p-8 shadow-neo max-w-4xl mx-auto mt-10">
          <div className="flex items-center justify-between mb-6">
             <h1 className="text-4xl font-black">{board.title}</h1>
             <span className="bg-accent text-white px-3 py-1 text-sm font-bold border-2 border-black">
                BOARD
             </span>
          </div>

          <p className="text-neutral-600">
             This is where your lists and tasks will live.
          </p>
       </div>
    </div>
    )
}