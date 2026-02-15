import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { ListForm } from "@/components/list-form";

function ListItem({list}: {list:any}) {
    return (
    <div className="shrink-0 w-80 bg-neutral-100 border-2 border-black shadow-neo p-2 mr-4 h-fit">
      <div className="flex items-center justify-between px-2 py-2">
         <h3 className="font-black text-sm">{list.title}</h3>
         <button className="hover:bg-neutral-200 p-1">...</button>
      </div>
      <div className="flex flex-col gap-y-2 mt-2">
         <p className="text-xs text-center p-2 border-2 border-dashed border-neutral-300">
            No tasks yet
         </p>
      </div>
    </div>
  )
}

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
        include: {
            lists: {
                orderBy: {order: "asc"}
            }
        }
    });

    if(!board) {
        redirect("/");
    }

    return (
       <div className="p-4 h-full min-h-screen bg-accent/20 overflow-x-auto">
            
            <div className="font-black text-2xl mb-6 bg-white w-fit px-4 py-2 border-2 border-black shadow-neo">
                {board.title}
            </div>

            <div className="flex gap-x-3 h-full items-start">
                
                {board.lists.map((list) => (
                    <ListItem key={list.id} list={list} />
                ))}

                <ListForm />
                
            </div>
        </div>
    )
}