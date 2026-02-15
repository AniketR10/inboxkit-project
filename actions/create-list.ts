"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db"; 
import { error } from "console";
import { revalidatePath } from "next/cache";

export async function createList(formData: FormData) {
    const {userId, orgId} = await auth();

    if(!userId) {
        return {error: "Unauthorized"};
    }

    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    if(!title || !boardId) {
        return {error: "Missing fields"};
    }

    try {
        const lastList = await prisma.list.findFirst({
            where: {"boardId": boardId},
            orderBy: {order: "desc"},
            select: {order: true},
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        await prisma.list.create({
            data: {
                title,
                boardId,
                order: newOrder,
            },
        });
        revalidatePath(`/board/${boardId}`);
        return {success: true};
    } catch(err) {
        return {error: "failed to create list"};
    }
}