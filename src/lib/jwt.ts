import jwt from "jsonwebtoken";

export function createToken(data: { email: string; userId: string }) {
   return jwt.sign(data, process.env.JWT_SECRET);
}
export function verifyToken(token: string) {
   return jwt.verify(token, process.env.JWT_SECRET);
}
