import { Timestamp } from "firebase-admin/firestore";
import { sendEmail } from "src/lib/brevo";
import { createToken } from "src/lib/jwt";
import { Auth } from "src/models/auth";

export async function sendAuthCode(email: string) {
   const auth = await Auth.findOrCreateByEmail(email);
   const { code, codeExpirationDate } = await auth.createCode();

   const message = `Tu código de autenticación es ${code} y vence a las ${codeExpirationDate}`;
   await sendEmail({
      subject: "Código de ingreso",
      text: message,
      recipientMail: email,
      recipientName: "Cómo te llames",
   });
}

export async function getToken(email: string, codeToCheck: number) {
   const auth = await Auth.findByEmail(email);
   if (!auth) throw new Error("User doesn't exist");
   const { code, codeExpirationDate, userId } = auth.getData();

   if (!code) throw new Error("No code available");
   if (code !== codeToCheck) throw new Error("Wrong code");

   const parsedExpirationDate = (codeExpirationDate as Timestamp).toDate();
   const expired = parsedExpirationDate < new Date();
   if (expired) throw new Error("Code expired!");

   return createToken({ email, userId });
}
