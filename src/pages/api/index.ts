import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler, testMiddle } from "src/lib/middlewares";

function hanlder(req: NextApiRequest, res: NextApiResponse) {
   console.log(req.body);
   console.log(req.query);

   res.send(`hola ${req.body.message}`);
}

export default reqVerbsHandler({
   get: {
      callback: hanlder,
      middlewares: [testMiddle],
   },
});
