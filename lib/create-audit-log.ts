import { auth, currentUser } from "@/lib/auth";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
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
    const session = await auth(); 
    const user = session?.user;  

    if (!user || !user.id) {
      throw new Error("User not found!");
    }


    const { entityId, entityType, entityTitle, action, boardId } = props;

    await prisma.auditLog.create({
      data: {
        orgId: user.id,
        entityId,
        entityType,
        entityTitle,
        action,
        boardId,
        userId: user.id,
        userImage: user.image || "",
        userName: user.name || "unknown user",
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};