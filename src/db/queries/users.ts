import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  console.log("insering", users);
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

    console.log("inserted", result);
  return result;
}

export async function deleteAllUsers() {
    await db.delete(users).execute();
}