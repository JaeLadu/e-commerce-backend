import { NextApiRequest, NextApiResponse } from "next";

type ReqVerbsObject = {
   get?: {
      callback: Function;
      middlewares?: Function[];
   };
   post?: {
      callback: Function;
      middlewares?: Function[];
   };
   patch?: {
      callback: Function;
      middlewares?: Function[];
   };
};

export function reqVerbsHandler(methodsObject: ReqVerbsObject) {
   return function returnFunction(req: NextApiRequest, res: NextApiResponse) {
      const reqMethod = req.method.toLocaleLowerCase();
      const methodAllowed = Object.hasOwn(methodsObject, reqMethod);
      if (!methodAllowed) {
         return res.status(405).end("No podés llamar a la api con este método");
      }
      methodsObject[reqMethod].callback(req, res);
   };
}
