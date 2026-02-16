"use server";

import prisma from "@/lib/db";
import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in all fields" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid email or password" };
  }

  await login({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.avatar,
  });

  redirect("/");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}