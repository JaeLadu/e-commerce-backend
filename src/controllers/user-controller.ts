import { User } from "src/models/user";

export async function getUser(id: string) {
   return await User.getById(id);
}
