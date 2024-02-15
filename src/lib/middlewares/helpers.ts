export type ReqVerbsObject = {
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

export function runChecker(checker, inputValueToCheck, upperLevel?) {
    //upperLevel is a helper for better error messages
    //checks every prop passed in the checker(config) against the values in req(inputValueToCheck)
    for (const key in checker) {
       if (Object.hasOwn(inputCheckerMap, key)) {
          try {
             //if the property exists in the map object, it calls it's asosiated function
             inputCheckerMap[key](inputValueToCheck, checker[key]);
          } catch (error) {
             //every function in the map object throws an error y the check doesn't pass
             //this error is handled here and a message is added for later handling
             throw new Error(
                `Request input error. ${upperLevel} ${error.message}`
             );
          }
       } else {
          //else, it calls itself again until true
          runChecker(checker[key], inputValueToCheck[key], key);
       }
    }
 }
 
 const inputCheckerMap = {
    required: (input, check) => {
       if (check == true && !input) {
          throw new Error("Is required");
       }
    },
    type: (input, check) => {
       if (input && typeof input !== check) {
          throw new Error(`must be ${check}`);
       }
    },
    value: (input, check) => {
       if (input && input !== check) {
          throw new Error(`must be ${check}`);
       }
    },
 };
 