import { NextApiRequest, NextApiResponse } from "next";
import { saveNewProduct } from "src/controllers/product-controller";
import {
   inputChecker,
   reqVerbsHandler,
   tokenChecker,
} from "src/lib/middlewares/middlewares";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
   const {
      body: { userId, productName, extraData },
   } = req;
   try {
      const product = await saveNewProduct(productName, userId, extraData);
      res.send({ product });
   } catch (error) {
      res.status(400).send(error.message);
   }
}

export default reqVerbsHandler({
   post: {
      callback: postHandler,
      middlewares: [tokenChecker, inputChecker],
      config: {
         inputChecker: {
            body: {
               userId: {
                  required: true,
                  type: "string",
               },
               productName: {
                  required: true,
                  type: "string",
               },
            },
         },
      },
   },
});
