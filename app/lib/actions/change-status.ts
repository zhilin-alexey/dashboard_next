"use server";

import { db } from "@/db";
import { clients } from "@/drizzle.schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function changeStatus(id: string, status: string) {
  const cal = await db
    .update(clients)
    .set({ status: status })
    .where(eq(clients.id, id));

  redirect("/dashboard");
}
