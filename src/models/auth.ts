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

   getData() {
      const data = Object.fromEntries(Object.entries(this));
      return data;
   }
   static async findOrCreateByEmail(email: string) {
      let docsList = await collection.where("email", "==", email).get();
      let doc;
      if (docsList.empty) {
         doc = await collection.add({ email });
      } else {
         doc = docsList[0];
      }
      return new Auth(doc.id, email);
   }

   async createCode() {
      this.code = Math.ceil(Math.random() * 10000);
      this.codeExpirationDate = new Date();
      this.codeExpirationDate.setMinutes(
         this.codeExpirationDate.getMinutes() + 10
      );
      const data = this.getData();

      await collection.doc(this.id).update(data);
      return data;
   }
}
