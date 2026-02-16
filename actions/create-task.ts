"use server";

import { createAuditLog } from "@/lib/create-audit-log";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
// import { ACTION, ENTITY_TYPE } from "@prisma/client";


export async function createTask(formData: FormData) {
    const {userId} = await auth();

    if(!userId) {
        return {error: "Unauthorized"};
    }

    const title = formData.get("title") as string;
    const listId = formData.get("listId") as string;
    const boardId = formData.get("boardId") as string;
    
    if(!title || !listId || !boardId){
        return {error: "Missing fields"};
    } 

    try {
        const lastTask = await prisma.task.findFirst({
            where: { listId: listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastTask ? lastTask.order + 1 : 1;

        const task = await prisma.task.create({
            data: {
                title,
                listId,
                order: newOrder,
            },
        });

        await createAuditLog({
            entityId: task.id,
            entityTitle: task.title,
            entityType: "CARD",
            action: "CREATE",
            boardId: boardId,
        })

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch(err) {
        return {error: "Failed to create task"};
    }
}