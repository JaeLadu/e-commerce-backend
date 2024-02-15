import { NextApiRequest, NextApiResponse } from "next";
import { ReqVerbsObject, runChecker } from "./helpers";

export function reqVerbsHandler(methodsObject: ReqVerbsObject) {
   //function that is returned for vercel to call
   return function (req: NextApiRequest, res: NextApiResponse) {
      const reqMethod: string = req.method.toLocaleLowerCase();
      const methodAllowed: boolean = Object.hasOwn(methodsObject, reqMethod);
      const middlewares: Function[] = methodsObject[reqMethod]?.middlewares;
      const callback: Function = methodsObject[reqMethod]?.callback;
      const config = methodsObject[reqMethod]?.config;

      // checking if the request method is allowed first
      if (!methodAllowed) {
         res.status(405).end(
            `The method you used (${reqMethod}) is not allowed`
         );
         return;
      }

      //executes middlewares
      if (middlewares) {
         Promise.all(
            middlewares.map(async (fn) => {
               try {
                  const { modifiedReq, modifiedRes } = await fn(
                     req,
                     res,
                     config
                  );
                  req = modifiedReq;
                  res = modifiedRes;
               } catch (error) {
                  res.send(error.message);
                  return;
               }
            })
         );
      }
      //executes callback
      callback(req, res);
   };
}

//middlewares
//all middlewares must return modifiedReq and modifiedRes
export function inputChecker(req, res, config) {
   const { inputChecker } = config;
   if (!inputChecker) {
      throw new Error("InputChecker config missing");
   }

   runChecker(inputChecker, req);

   const modifiedReq = req;
   const modifiedRes = res;
   return { modifiedReq, modifiedRes };
}
