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

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid email or password" };
  }

  await login({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  });

  redirect("/"); 
}

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Please fill in all fields" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "User already exists. Please login." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image: defaultAvatar, 
    },
  });

  await login({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  });

  redirect("/");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}