import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "src/controllers/user-controller";
import { reqVerbsHandler, tokenChecker } from "src/lib/middlewares/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const {
      body: {
         info: { userId },
      },
   } = req;

   const userInfo = await getUser(userId);
   if (!userInfo) {
      res.status(404).end("User not found");
      return;
   }
   res.send(userInfo);
}

export default reqVerbsHandler({
   get: {
      callback: handler,
      middlewares: [tokenChecker],
   },
});
