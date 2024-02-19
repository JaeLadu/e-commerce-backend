import { Product } from "src/models/product";

export async function saveNewProduct(
   productName: string,
   ownerId: string,
   data?
) {
   try {
      return await Product.create(productName, ownerId, data);
   } catch (error) {
      return error;
   }
}

export async function getProductById(id: string) {
   const product = await Product.getById(id);
   if (!product)
      throw new Error(
         JSON.stringify({ message: "product missing", status: 404 })
      );
   return product;
}
