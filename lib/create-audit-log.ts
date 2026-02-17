import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

// export enum ACTION {
//   CREATE = "CREATE",
//   UPDATE = "UPDATE",
//   DELETE = "DELETE"
// }

// export enum ENTITY_TYPE {
//   BOARD = "BOARD",
//   LIST = "LIST",
//   CARD = "CARD"
// }

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