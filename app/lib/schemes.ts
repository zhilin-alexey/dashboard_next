import { selectUsersSchema } from "@/drizzle.schema";

export const loginFormSchema = selectUsersSchema.omit({
    id: true,
    fullName: true,
  });