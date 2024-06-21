"use server";

import { db } from "@/db";
import { sessions, users as usersTable } from "@/drizzle.schema";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { loginFormSchema } from "../schemes";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function onSubmit(data: z.infer<typeof loginFormSchema>) {
  console.log(data);

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.login, data.login));

  if (!users || users.length === 0) {
    throw new Error("Неверный логин или пароль");
  }
  if (!(await argon2.verify(users[0].password, data.password))) {
    throw new Error("Неверный логин или пароль");
  }

  const session = await db
    .insert(sessions)
    .values({ userId: users[0].id })
    .returning();

  cookies().set("session", session[0].token, { sameSite: "strict", expires: Date.now() + 1000 * 60 * 60 * 24 * 7 });

  redirect("/dashboard");
}
