import { db } from "@/db";
import {
  insertClientsSchema,
  insertUsersSchema,
  users as usersTable,
  clients as clientsTable
} from "@/drizzle.schema";
import { faker } from "@faker-js/faker/locale/ru";
import argon2 from "argon2";
import { count as countRows } from "drizzle-orm";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const users_count = Number(process.env.GENERATE_USERS_COUNT) || 50;
  const clients_count = Number(process.env.GENERATE_CLIENTS_COUNT) || 50;

  const currentUsersCount = await db
    .select({ count: countRows() })
    .from(usersTable);
  if (currentUsersCount[0].count >= users_count) {
    console.log("Users already generated, skipping...");
    return NextResponse.json({ ok: true });
  }

  console.log(
    `Generating ${users_count} users and ${clients_count} clients...`
  );

  const [users, hashedUsers] = await generate_users(users_count);
  const clients = await generate_clients(clients_count, users);
  console.log("Inserting users and clients...");

  await db.insert(usersTable).values(hashedUsers as never[]);
  await db.insert(clientsTable).values(clients as never[]);

  writeFile("logins.json", JSON.stringify(users, null, 4), {
    encoding: "utf-8",
  });
  console.log("Users logins and passwords saved to logins.json");

  return NextResponse.json({ ok: true });
}

async function generate_clients(
  count: number,
  users: z.infer<typeof insertUsersSchema>[]
) {
  const clients: z.infer<typeof insertClientsSchema>[] = [];

  for (let i = 0; i < count; i++) {
    clients.push({
      accountNumber: faker.number.int({ min: 1000000000, max: 9999999999 }),
      lastName: faker.person.lastName(),
      fistName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      birthdayDate: faker.date.birthdate().toDateString(),
      inn: faker.number.int({ min: 100000000000, max: 999999999999 }),
      accountableFullName:
        users[faker.number.int({ min: 0, max: users.length - 1 })].fullName,
      status: faker.helpers.arrayElement([
        "IN WORK",
        "REJECTED",
        "DEAL_CLOSED",
      ]),
    });
  }

  return clients;
}

async function generate_users(count: number) {
  const users: z.infer<typeof insertUsersSchema>[] = [];
  const hashedUsers = [];
  for (let i = 0; i < count; i++) {
    const user = {
      fullName: faker.person.fullName(),
      login: faker.internet.userName(),
      password: faker.internet.password(),
    };

    users.push(user);

    hashedUsers.push({
      ...user,
      password: await argon2.hash(user.password),
    });
  }
  return [users, hashedUsers];
}
