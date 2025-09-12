import db from "./db";
import { compareSync } from "bcrypt-ts";

export async function findUserByCredentials(username: string, password: string) {
  try {
    console.log(`Attempting to find user: ${username}`);
    
    const user = await db.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.log(`User not found: ${username}`);
      return null;
    }

    console.log(`User found: ${user.username}, comparing passwords...`);
    
    // Check if the user has a password set
    if (!user.password) {
      console.log(`User has no password set: ${username}`);
      return null;
    }

    const passwordMatch = compareSync(password, user.password);

    if (passwordMatch) {
      console.log(`Password match for user: ${username}`);
      return {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      };
    } else {
      console.log(`Password mismatch for user: ${username}`);
      return null;
    }
  } catch (error) {
    console.error("Error in findUserByCredentials:", error);
    return null;
  }
}