import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { format } from "date-fns";

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
        <li key={log.id} className="flex items-center gap-x-2">
          <img 
            src={log.userImage} 
            alt="User" 
            className="h-8 w-8 rounded-full border-2 border-black"
          />
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm text-neutral-700">
              <span className="font-bold text-black">{log.userName}</span>{" "}
              {log.action === "CREATE" ? "created" : "updated"}{" "}
              {log.entityType.toLowerCase()}{" "}
              <span className="font-bold text-black">"{log.entityTitle}"</span>
            </p>
            <p className="text-xs text-neutral-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
};