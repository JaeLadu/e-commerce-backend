import { NextApiRequest, NextApiResponse } from "next";

type ReqVerbsObject = {
   get?: {
      callback: Function;
      middlewares?: Function[];
      config?: {
         inputChecker: {
            body?: {
               [key: string]: {
                  required?: boolean;
                  type?: string;
                  value?: any;
               };
            };
            query?: {
               [key: string]: {
                  required?: boolean;
                  type?: string;
                  value?: any;
               };
            };
         };
      };
   };
   post?: {
      callback: Function;
      middlewares?: Function[];
      config?: {
         inputChecker: {
            body?: {
               [key: string]: {
                  required?: boolean;
                  type?: string;
                  value?: any;
               };
            };
            query?: {
               [key: string]: {
                  required?: boolean;
                  type?: string;
                  value?: any;
               };
            };
         };
      };
   };
   patch?: {
      callback: Function;
      middlewares?: Function[];
      config?: {
         inputChecker: {
            body?: {
               [key: string]: {
                  required?: boolean;
                  type?: string;
                  value?: any;
               };
            };
            query?: {
               [key: string]: {
                  required?: boolean;
                  type?: string;
                  value?: any;
               };
            };
         };
      };
   };
};

export function reqVerbsHandler(methodsObject: ReqVerbsObject) {
   return function (req: NextApiRequest, res: NextApiResponse) {
      // checking if the request method is allowed
      const reqMethod: string = req.method.toLocaleLowerCase();
      const methodAllowed: boolean = Object.hasOwn(methodsObject, reqMethod);
      const middlewares: Function[] = methodsObject[reqMethod]?.middlewares;
      const callback: Function = methodsObject[reqMethod]?.callback;
      const config = methodsObject[reqMethod]?.config;

      if (!methodAllowed) {
         res.status(405).end("No podés llamar a la api con este método");
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

//helpers
function runChecker(checker, inputValueToCheck, upperLevel?) {
   //checks every prop passed in the checker against the values in req(inputValueToCheck)
   for (const key in checker) {
      if (Object.hasOwn(inputCheckerMap, key)) {
         try {
            //if the property exists in the map object, it calls it's asosiated function
            inputCheckerMap[key](inputValueToCheck, checker[key]);
            return;
         } catch (error) {
            //every function in the map object throws an error y the check doesn't pass
            //this error is handled here and a message is added for later handling
            throw new Error(
               `Request input error. ${JSON.stringify(upperLevel)}`
            );
         }
      }
      //else, it calls itself again until true
      runChecker(checker[key], inputValueToCheck[key], checker);
   }
}

const inputCheckerMap = {
   required: (input, check) => {
      if (check == true && !input) {
         throw new Error();
      }
   },
   type: (input, check) => {
      if (input && typeof input !== check) {
         throw new Error();
      }
   },
   value: (input, check) => {
      if (input && input !== check) {
         throw new Error();
      }
   },
};
