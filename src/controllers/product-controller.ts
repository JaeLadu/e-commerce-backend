import { Product } from "src/models/product";

export async function saveNewProduct(
   productName: string,
   ownerId: string,
   data?
) {
   try {
      return await Product.create(productName, ownerId, data);
   } catch (error) {}
}
