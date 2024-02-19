import { firestoreDB } from "src/lib/firestore";
import { Model } from "./baseModel";
import { AlgoliaProductsIndex } from "src/lib/algolia";

const collection = firestoreDB.collection("products");

export class Product extends Model {
   name: string;
   ownerId: string;
   price: number;
   description: string;
   stock: number;
   sellCount: number;

   constructor(id: string, data?, email: string = "") {
      //email is required by the parent Model, but useless in Product
      //So, constructor deletes it
      super(id, email, data);
      delete this.email;
   }

   static async create(name: string, ownerId: string, data?) {
      //saves the new product in firestore first
      const product = await (
         await collection.add({
            name,
            ownerId,
            price: 0,
            description: "",
            stock: 0,
            sellCount: 0,
            ...data,
         })
      ).get();
      //then, saves searchable data in algolia for fast search
      await AlgoliaProductsIndex.saveObject({
         objectID: product.id,
         ...product.data(),
      });
      // returns the product
      return new Product(product.id, product.data());
   }

   static async search(query: string, limit = 10, offset = 0) {
      const results = await AlgoliaProductsIndex.search(query, {
         offset,
         length: limit,
      });
      return results.hits;
   }

   async push(data?) {
      if (data) {
         this.setData(data);
      }
      await collection.doc(this.id).update(data);
      return;
   }

   static async getById(id: string) {
      const doc = await collection.doc(id).get();

      if (!doc.exists) return false;

      const product = new Product(doc.id, doc.data());

      return product;
   }

   static async findOrCreate(id: string) {
      const found = await Product.getById(id);
      if (!found) {
         const product = found as Product;
         const { ownerId } = product.getData();
         return await Product.create(id, ownerId, product.getData());
      }
      return found;
   }
}
