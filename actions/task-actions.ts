"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";

export async function updateTask(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const boardId = formData.get("boardId") as string;
  const title = formData.get("title") as string;
  const status = formData.get("status") as any;
  const description = formData.get("description") as string;
  const assignedTo = formData.get("assignedTo") as string;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(status && { status }),
        ...(description && { description }),
        ...(assignedTo !== null && { assignedTo }),
      },
    });

    await createAuditLog({
      entityId: task.id,
      entityTitle: task.title,
      entityType: "CARD",
      action: "UPDATE",
      boardId,
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update task" };
  }
}

export async function deleteTask(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const boardId = formData.get("boardId") as string;

  try {
    const task = await prisma.task.delete({
      where: { id },
    });

    await createAuditLog({
      entityId: task.id,
      entityTitle: task.title,
      entityType: "CARD",
      action: "DELETE",
      boardId,
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete task" };
  }
}