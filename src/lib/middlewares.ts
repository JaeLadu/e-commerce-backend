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
   return function (req: NextApiRequest, res: NextApiResponse) {
      // checking if the request method is allowed
      const reqMethod: string = req.method.toLocaleLowerCase();
      const methodAllowed: boolean = Object.hasOwn(methodsObject, reqMethod);
      const middlewares: Function[] = methodsObject[reqMethod]?.middlewares;
      const callback: Function = methodsObject[reqMethod]?.callback;
      if (!methodAllowed) {
         res.status(405).end("No podés llamar a la api con este método");
         return;
      }

      //executes middlewares
      if (middlewares) {
         Promise.all(
            middlewares.map(async (fn) => {
               const { modifiedReq, modifiedRes } = await fn(req, res);
               req = modifiedReq;
               res = modifiedRes;
            })
         );
      }
      //executes callback
      callback(req, res);
   };
}

//all middlewares must return modifiedReq and modifiedRes
//eliminar
export function testMiddle(req, res) {
   const modifiedReq = req;
   const modifiedRes = res;

   modifiedReq.body.mod = "Mod";
   modifiedReq.query.mod = "Mod";
   return { modifiedReq, modifiedRes };
}
