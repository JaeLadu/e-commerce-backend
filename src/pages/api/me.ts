import { NextApiRequest, NextApiResponse } from "next";
import { getUser, updateUser } from "src/controllers/user-controller";
import { reqVerbsHandler, tokenChecker } from "src/lib/middlewares/middlewares";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
   const {
      body: { userId },
   } = req;

   const userInfo = await getUser(userId);
   if (!userInfo) {
      res.status(404).end("User not found");
      return;
   }
   res.send(userInfo);
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
   const { body } = req;
   const { userId } = body;
   try {
      updateUser(userId, body);
      res.status(200).end();
      return;
   } catch (error) {
      res.status(404).end(error.message);
   }
}

export default reqVerbsHandler({
   get: {
      callback: getHandler,
      middlewares: [tokenChecker],
   },
   patch: {
      callback: patchHandler,
      middlewares: [tokenChecker],
   },
});
