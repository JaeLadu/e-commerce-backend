import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "../../lib/middlewares";

function hanlder(req: NextApiRequest, res: NextApiResponse) {
   res.send(`hola ${req.body.message}`);
}

export default reqVerbsHandler({
   get: {
      callback: hanlder,
   },
});
