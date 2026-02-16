import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";
const key = new TextEncoder().encode(SECRET_KEY);

const SHARED_ORG_ID = "org_shared_workspace"; 

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 week")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(userData: any) {

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ user: userData, expires });

  (await cookies()).set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function auth() {
  const session = await getSession();

  if (!session) {
    return { 
       userId: null, 
       orgId: null, 
       user: null 
    };
  }

  return { 
    userId: session.user.id, 

    orgId: SHARED_ORG_ID, 
    user: session.user 
  };
}

export async function currentUser() {
   const { user } = await auth();
   return user ? { 
       id: user.id, 
       firstName: user.name.split(" ")[0], 
       lastName: user.name.split(" ")[1] || "", 
       imageUrl: user.image 
   } : null;
}