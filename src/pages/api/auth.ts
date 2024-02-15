import { NextApiRequest, NextApiResponse } from "next";
import { sendAuthCode } from "src/controllers/auth-controller";
import { inputChecker, reqVerbsHandler } from "src/lib/middlewares";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
   //returns authentication code
   const { query } = req;
   const { email } = query;
   await sendAuthCode(email as string);
   res.status(200).end();
   return;
}
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
   const { query } = req;
   const { email, code, message } = query;
   res.send(message);
}

export default reqVerbsHandler({
   get: {
      callback: getHandler,
   },
   post: {
      callback: postHandler,
      middlewares: [inputChecker],
      config: {
         inputChecker: {
            query: {
               message: {
                  required: true,
                  type: "string",
               },
            },
            body: {
               email: {
                  required: true,
                  type: "string",
               },
               code: {
                  required: true,
                  type: "number",
               },
            },
         },
      },
   },
});
