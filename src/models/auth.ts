import { firestoreDB } from "src/lib/firestore";
import { Model } from "./baseModel";
import { User } from "./user";

const collection = firestoreDB.collection("auths");

export class Auth extends Model {
   code?: number;
   codeExpirationDate?: Date;
   userId: string;

   constructor(id: string, email: string, data?) {
      super(id, email, data);
   }

   static async create(email: string) {
      const user = await User.findOrCreateByEmail(email);
      const authDocReference = await collection.add({ email, userId: user.id });
      const auth = new Auth(authDocReference.id, email, { userId: user.id });

      return auth;
   }

   static async getById(id: string) {
      const doc = await collection.doc(id).get();
      if (!doc.exists) return false;

      const auth = new Auth(doc.id, doc.data().email, doc.data());

      return auth;
   }

   static async findByEmail(email: string) {
      let docsList = await collection.where("email", "==", email).get();
      if (docsList.empty) {
         return false;
      }
      const doc = docsList.docs[0];

      const auth = new Auth(doc.id, email, doc.data());

      return auth;
   }

   static async findOrCreateByEmail(email: string): Promise<Auth> {
      const found = await Auth.findByEmail(email);

      if (!found) {
         return await Auth.create(email);
      }
      return found;
   }

   async createCode() {
      this.code = Math.ceil(Math.random() * 10000);
      this.codeExpirationDate = new Date();
      this.codeExpirationDate.setMinutes(
         this.codeExpirationDate.getMinutes() + 10
      );
      const data = this.getData(false);

      await collection.doc(this.id).update(data);
      return data;
   }
}
