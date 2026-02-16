"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db"; 
import { error } from "console";
import { revalidatePath } from "next/cache";
import { ENTITY_TYPE, ACTION } from "@/app/generated/prisma/enums";
import { createAuditLog } from "@/lib/create-audit-log";

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
    const firstList = await prisma.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "asc" },
      select: { order: true },
    });

    const newOrder = firstList ? firstList.order - 1 : 1;

    const list = await prisma.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
      boardId: boardId,
    });

        revalidatePath(`/board/${boardId}`);
        return {success: true};
    } catch(err) {
        return {error: "failed to create list"};
    }
}