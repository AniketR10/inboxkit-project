import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { ListForm } from "@/components/list-form";
import { ListItem } from "@/components/list-item";

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
                orderBy: {order: "asc"},
                include: {
                    tasks: {
                        orderBy: {order: 'asc'}
                    }
                }
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