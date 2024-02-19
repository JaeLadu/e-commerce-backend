import { NextApiRequest, NextApiResponse } from "next";
import {
   inputChecker,
   reqVerbsHandler,
   tokenChecker,
} from "src/lib/middlewares/middlewares";

function postHandler(req: NextApiRequest, res: NextApiResponse) {
   const {
      body: { userId, productName, extraData },
   } = req;
   res.send({ userId, productName, extraData });
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
