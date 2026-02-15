"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

interface UpdateListOrderProps {
  items: { id: string; title: string; order: number; boardId: string }[];
  boardId: string;
}

export async function updateListOrder({ items, boardId }: UpdateListOrderProps) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  console.log("Reordering Lists...", items.length, "items");

  try {
    const transaction = items.map((list) =>
      prisma.list.update({
        where: {
          id: list.id,
        },
        data: {
          order: list.order,
        },
      })
    );

    await prisma.$transaction(transaction);
    revalidatePath(`/board/${boardId}`);
    
    console.log("SUCCESS: Lists reordered");
    return { success: true };

  } catch (error) {
    console.error("List Reorder Error:", error);
    return { error: "Failed to reorder." };
  }
}