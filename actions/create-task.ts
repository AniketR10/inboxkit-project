"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


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

        await prisma.task.create({
            data: {
                title,
                listId,
                order: newOrder,
            },
        });

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch(err) {
        return {error: "Failed to create task"};
    }
}