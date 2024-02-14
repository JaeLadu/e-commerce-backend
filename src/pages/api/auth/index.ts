import { NextApiRequest, NextApiResponse } from "next";
import { sendAuthCode } from "src/controllers/auth-controller";
import { reqVerbsHandler } from "src/lib/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { body } = req;
   const { email } = body;
   await sendAuthCode(email);
   return;
}

export default reqVerbsHandler({
   post: {
      callback: handler,
   },
});
