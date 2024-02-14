import { SendSmtpEmail, TransactionalEmailsApi } from "@getbrevo/brevo";

let apiInstance = new TransactionalEmailsApi();

let apiKey = apiInstance["authentications"]["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

let emailToSend = new SendSmtpEmail();

type mailProps = {
   subject: string;
   text: string;
   recipientMail: string;
   recipientName: string;
};

export async function sendEmail(mailData: mailProps) {
   emailToSend = {
      sender: { name: "Jae dev", email: "jaeladu1@gmail.com" },
      replyTo: { email: "jaeladu1@gmail.com", name: "Jae recibe" },
      subject: mailData.subject,
      textContent: mailData.text,
      to: [{ email: mailData.recipientMail, name: mailData.recipientName }],
   };

   const response = await apiInstance.sendTransacEmail(emailToSend);

   return response;
}
