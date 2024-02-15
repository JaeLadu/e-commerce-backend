import { firestoreDB } from "src/lib/firestore";

const collection = firestoreDB.collection("auth");

export class Auth {
   id: string;
   email: string;
   code?: number;
   codeExpirationDate?: Date;

   constructor(id: string, email: string) {
      this.id = id;
      this.email = email;
   }

   getData(id: boolean = true) {
      //has the option to return data with or withoit the id prop. Useful for savig the object in the database
      if (id) {
         const data = Object.fromEntries(Object.entries(this));
         return data;
      }
      const data = Object.fromEntries(Object.entries(this));
      delete data.id;
      return data;
   }

   setData(data) {
      Object.assign(this, data);
   }

   static async findByEmail(email: string) {
      let docsList = await collection.where("email", "==", email).get();
      if (docsList.empty) {
         return false;
      }
      const doc = docsList.docs[0];

      const auth = new Auth(doc.id, email);
      auth.setData(doc.data());

      return auth;
   }

   static async findOrCreateByEmail(email: string): Promise<Auth> {
      let doc;
      const found = await Auth.findByEmail(email);

      if (!found) {
         doc = await collection.add({ email });
         return new Auth(doc.id, email);
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
