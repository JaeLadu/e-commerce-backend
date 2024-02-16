import { firestoreDB } from "src/lib/firestore";
import { Model } from "./baseModel";

const collection = firestoreDB.collection("users");

export class User extends Model {
   name: string;
   lastName: string;

   constructor(id: string, email: string, data?) {
      super(id, email, data);
   }

   static async create(email: string) {
      const user = await collection.add({ email });
      return new User(user.id, email);
   }

   static async getById(id: string) {
      const doc = await collection.doc(id).get();

      if (!doc.exists) return false;

      const user = new User(doc.id, doc.data().email, doc.data());

      return user;
   }

   static async findByEmail(email: string) {
      let docsList = await collection.where("email", "==", email).get();
      if (docsList.empty) {
         return false;
      }
      const doc = docsList.docs[0];

      const user = new User(doc.id, email, doc.data());

      return user;
   }

   static async findOrCreateByEmail(email: string): Promise<User> {
      const found = await User.findByEmail(email);
      if (!found) {
         return await User.create(email);
      }
      return found;
   }
}
