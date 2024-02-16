import { firestoreDB } from "src/lib/firestore";

export class Model {
   id: string;
   email: string;

   constructor(id: string, email: string, data?) {
      this.id = id;
      this.email = email;
      this.setData(data);
   }

   getData(id: boolean = true) {
      //has the option to return data with or withoit the id prop. Useful for savig the object in the database
      const data = Object.fromEntries(Object.entries(this));
      if (id) {
         return data;
      }
      delete data.id;
      return data;
   }

   setData(data) {
      Object.assign(this, data);
   }
}
