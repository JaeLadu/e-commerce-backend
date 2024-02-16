import jwt, { JwtPayload } from "jsonwebtoken";

export function createToken(data: { email: string; userId: string }) {
   return jwt.sign(data, process.env.JWT_SECRET);
}
export function verifyToken(token: string) {
   const info = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
   delete info.iat;
   return info;
}
