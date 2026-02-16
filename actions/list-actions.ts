"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
// import { ACTION, ENTITY_TYPE } from "@prisma/client";

export async function updateList(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const boardId = formData.get("boardId") as string;
  const title = formData.get("title") as string;

  await prisma.list.update({
    where: { id },
    data: { title },
  });

  revalidatePath(`/board/${boardId}`);
  return { success: true };
}

export async function deleteList(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const boardId = formData.get("boardId") as string;

  const list = await prisma.list.delete({
    where: { id },
  });

  await createAuditLog({
    entityId: list.id,
    entityTitle: list.title,
    entityType: "LIST",
    action: "DELETE",
    boardId,
  });

  revalidatePath(`/board/${boardId}`);
  return { success: true };
}