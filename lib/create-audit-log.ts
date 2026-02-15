import { auth, currentUser } from "@clerk/nextjs/server";
import { ENTITY_TYPE, ACTION } from "@/app/generated/prisma/enums";
import prisma from "@/lib/db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
  boardId: string;
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId: clerkOrgId } = await auth();
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found!");
    }

    const orgId = clerkOrgId || user.id;

    const { entityId, entityType, entityTitle, action, boardId } = props;

    await prisma.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        boardId,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};