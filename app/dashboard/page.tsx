import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/ui/datatable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { db } from "@/db";
import {
  clients as clientsTable,
  sessions as sessionsTable,
  users,
} from "@/drizzle.schema";
import { eq, sql } from "drizzle-orm";
import { useEffect } from "react";

export default async function Dashboard() {
  if (!cookies().has("session")) {
    redirect("/");
  }

  async function logout() {
    "use server";
    cookies().delete("session");
    redirect("/");
  }

  async function getData() {
    "use server";

    const token = cookies().get("session");
    return await db.execute(sql`SELECT c.*
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      JOIN clients c ON c.accountable_full_name = u.full_name
      WHERE s.token = ${token?.value};`);
  }
  let data = await getData();

  return (
    <main className="px-7 min-h-screen py-5">
      <DashboardHeader logout={logout} />

      {data && <DataTable columns={columns} data={data} name="клиентов" />}
    </main>
  );
}
