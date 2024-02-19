import { NextApiRequest, NextApiResponse } from "next";
import { getProductById } from "src/controllers/product-controller";
import { reqVerbsHandler, inputChecker } from "src/lib/middlewares/middlewares";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
   const {
      query: { id },
   } = req;
   try {
      const product = await getProductById(id as string);
      res.send(product);
   } catch (error) {
      const errorData = JSON.parse(error.message);
      res.status(errorData.status).end(errorData.message);
   }
}

export default reqVerbsHandler({
   get: {
      callback: getHandler,
      middlewares: [inputChecker],
      config: {
         inputChecker: {
            query: {
               id: {
                  required: true,
                  type: "string",
               },
            },
         },
      },
   },
});
