import { NextApiRequest, NextApiResponse } from "next";
import { sendAuthCode, getToken } from "src/controllers/auth-controller";
import { inputChecker, reqVerbsHandler } from "src/lib/middlewares/middlewares";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
   //returns authentication code
   const { query } = req;
   const { email } = query;
   await sendAuthCode(email as string);
   res.status(200).end();
   return;
}
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
   const { body } = req;
   const { email, code } = body;
   try {
      const token = await getToken(email, code);
      res.send({ token });
   } catch (error) {
      res.send(error.message);
   }
}

export default reqVerbsHandler({
   get: {
      callback: getHandler,
      middlewares: [inputChecker],
      config: {
         inputChecker: {
            query: {
               email: {
                  required: true,
               },
            },
         },
      },
   },
   post: {
      callback: postHandler,
      middlewares: [inputChecker],
      config: {
         inputChecker: {
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
