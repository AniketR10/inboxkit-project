import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { User } from "lucide-react";

interface ActivityListProps {
  boardId: string;
}

export const ActivityList = async ({ boardId }: ActivityListProps) => {
  const logs = await prisma.auditLog.findMany({
    where: {
      boardId: boardId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <ol className="mt-4 space-y-4">
      <h3 className="font-bold text-lg mb-2">Activity History</h3>

      {logs.length === 0 && (
         <p className="text-sm text-neutral-500">No activity yet.</p>
      )}

      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-x-3">
          <div className="h-8 w-8 shrink-0 bg-neutral-200 border border-black flex items-center justify-center overflow-hidden">
            {log.userImage ? (
              <img
                src={log.userImage}
                alt={log.userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-neutral-500" />
            )}
          </div>

          <div className="flex flex-col space-y-0.5">
            <p className="text-sm text-black">
              <span className="font-bold">{log.userName}</span> {log.action.toLowerCase()} {log.entityType.toLowerCase()} "{log.entityTitle}"
            </p>
            <p className="text-[10px] text-neutral-500 font-medium">
              {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      ))}
    </ol>
  );
};