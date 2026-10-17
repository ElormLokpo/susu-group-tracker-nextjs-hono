import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.EMAIL_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  void to;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["benedictdev31@gmail.com"],
    subject: subject,
    html: html,
  });
};
