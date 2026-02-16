"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBoard(formData: FormData) {
  const boardId = formData.get("boardId") as string;

  if (!boardId) return;

  try {
    await prisma.board.delete({
      where: {
        id: boardId,
      },
    });
    
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete board", error);
  }
}