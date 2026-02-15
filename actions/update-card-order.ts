"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

interface UpdateCardOrderProps {
  items: { id: string; title: string; order: number; listId: string }[];
  boardId: string;
}

export async function updateCardOrder({ items, boardId }: UpdateCardOrderProps) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  console.log("Reordering Cards...", items.length, "items");

  try {
    const transaction = items.map((card) =>
      prisma.task.update({
        where: {
          id: card.id,
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    await prisma.$transaction(transaction);
    revalidatePath(`/board/${boardId}`);
    
    console.log("SUCCESS: Cards reordered");
    return { success: true };
    
  } catch (error) {
    console.error("Card Reorder Error:", error);
    return { error: "Failed to reorder." };
  }
}