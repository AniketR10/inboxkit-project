import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { ListContainer } from "@/components/list-container";
import { ActivityList } from "@/components/activity-list";
import { ListForm } from "@/components/list-form";

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
    <div className="p-4 min-h-screen bg-accent/20">
      
      <div className="font-black text-2xl mb-6 bg-white w-fit px-4 py-2 border-2 border-black shadow-neo">
        {board.title}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        <div className="w-full lg:w-[70%]">
          <ListContainer boardId={boardId} data={board.lists} />
        </div>


        <div className="w-full lg:w-[28%] shrink-0 sticky top-20 flex flex-col gap-y-6">

             <div className="bg-white border-2 border-black shadow-neo p-4">
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide text-neutral-500">Actions</h3>
                <ListForm />
            </div>
 
            <div className=" border-2 border-black shadow-neo p-4 h-fit max-h-[60vh] overflow-y-auto">
                <ActivityList boardId={boardId} />
            </div>

        </div>
        
      </div>
    </div>
  );
}