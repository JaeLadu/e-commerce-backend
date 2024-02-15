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
      const data = this.getData(false);

      await collection.doc(this.id).update(data);
      return data;
   }
}
