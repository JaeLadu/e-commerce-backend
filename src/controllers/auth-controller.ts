import { sendEmail } from "src/lib/brevo";
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
