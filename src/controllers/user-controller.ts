import { User } from "src/models/user";

export async function getUser(userId) {
   return await User.getById(userId);
}

export async function updateUser(userId: string, data) {
   const user = await getUser(userId);
   if (!user) throw new Error("User not found");

   try {
      await user.push(data);
      return;
   } catch (error) {
      throw new Error(error.message);
   }
}
