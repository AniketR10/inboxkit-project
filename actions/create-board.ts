"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Title is too short",
  }),
});

export async function createBoard(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;

  const validatedFields = CreateBoard.safeParse({ title });

  if (!validatedFields.success) {
    throw new Error("Invalid Fields");
  }

  const board = await prisma.board.create({
    data: {
      title,
      orgId: orgId || userId,
      imageId: "unsplash-placeholder",
      imageThumbUrl: "https://placehold.co/600x400/png",
      imageFullUrl: "https://placehold.co/600x400/png",
      imageUserName: "User",
      imageLinkHTML: "Link",
    },
  });

  revalidatePath("/");
  redirect(`/board/${board.id}`);
}
