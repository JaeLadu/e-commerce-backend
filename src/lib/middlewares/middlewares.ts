import { NextApiRequest, NextApiResponse } from "next";
import { ReqVerbsObject, runChecker } from "./helpers";
import { verifyToken } from "../jwt";

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
//all middlewares must return modifiedReq and modifiedRes or errors with message if something goes wrong
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

export function tokenChecker(req, res) {
   const modifiedReq = req;
   const modifiedRes = res;
   const {
      headers: { authorization },
   } = req;
   const contents = authorization.split(" ");
   const bearer = contents[0] == "bearer";
   const token = contents[1];

   if (!bearer) throw new Error('Authorization must be: "bearer token"');

   const tokenInfo = verifyToken(token);

   try {
      modifiedReq.body["info"] = tokenInfo;
   } catch (e) {
      modifiedReq.body = { info: tokenInfo };
   }

   return { modifiedReq, modifiedRes };
}
